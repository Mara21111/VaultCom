using Google.Protobuf;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Crmf;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services.Implementations
{
    public class MessageService : IMessageService
    {
        private readonly MyContext context;
        private readonly IUserService _userService;

        public MessageService(MyContext context, IUserService userService)
        {
            this.context = context;
            _userService = userService;
        }

        bool IsLinkRegex(string content)
        {
            return Regex.IsMatch(content, @"^(https?://)?www(\.[a-zA-Z0-9]{2,})+(/[a-zA-Z0-9_\-/]*)?$");
        }

        public async Task<ServiceResult> SendMessageAsync(MessageDTO dto)
        {
            await _userService.SetActivityAsync(dto.UserId);

            if (dto.Content.Length == 0)
                return new ServiceResult { Success = false, ErrorMessage = "empty message" };
            var chat = await context.Chat.FindAsync(dto.ChatId);
            if (chat is null)
                return new ServiceResult { Success = false, ErrorMessage = "chat does not exist" };

            var msg = new Message
            {
                UserId = dto.UserId,
                ChatId = dto.ChatId,
                Content = dto.Content,
                SelfContent = "",
                URLLink = IsLinkRegex(dto.Content) ? dto.Content : "",
                Time = DateTime.Now,
                IsEdited = false,
                IsPinned = false,
                PreviousMessageId = dto.ReplyMessageId.HasValue ? dto.ReplyMessageId.Value : 0,
            };

            if (chat.Type == 3)
            {
                return await SendEncryptedMessageAsync(dto, msg);
            }

            if (!await dto.InChat(context))
                return new ServiceResult { Success = false, ErrorMessage = "user not in chat" };

            context.Message.Add(msg);
            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = msg };
        }

        public async Task<ServiceResult> SendEncryptedMessageAsync(MessageDTO dto, Message msg)
        {
            PrivateChat chat = await context.PrivateChat.FindAsync(context.Chat.Find(dto.ChatId).ChatId);
            if (chat == null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "chat not found" };
            }

            var user = await context.User.FindAsync(dto.UserId);
            var otherUser = await context.User.FindAsync(chat.GetOtherUser(dto.UserId));

            try
            {
                using (var rsa = RSA.Create())
                {
                    byte[] messageBytes = Encoding.UTF8.GetBytes(msg.Content);

                    // pro other
                    rsa.ImportSubjectPublicKeyInfo(Convert.FromBase64String(otherUser.PublicKey), out _);
                    byte[] encyptedOther = rsa.Encrypt(messageBytes, RSAEncryptionPadding.OaepSHA256);
                    msg.Content = Convert.ToBase64String(encyptedOther);

                    // pro sebe
                    rsa.ImportSubjectPublicKeyInfo(Convert.FromBase64String(user.PublicKey), out _);
                    byte[] encryptedSelf = rsa.Encrypt(messageBytes, RSAEncryptionPadding.OaepSHA256);
                    msg.SelfContent = Convert.ToBase64String(encryptedSelf);
                }

                context.Message.Add(msg);
                await context.SaveChangesAsync();

                return new ServiceResult { Success = true, Data = msg };
            }
            catch (Exception ex)
            {
                return new ServiceResult { Success = false, ErrorMessage = $"encryption failed coz of: {ex.Message}" };
            }
        }

        public async Task<ServiceResult> GetMessagesInChatAsync(int userId, int chatId)
        {
            await _userService.SetActivityAsync(userId);

            var user = await context.User.FindAsync(userId);
            if (user is null)
                return new ServiceResult { Success = false, ErrorMessage = "user does not exist" };
            var chat = await context.Chat.FindAsync(chatId);
            if (chat is null)
                return new ServiceResult { Success = false, ErrorMessage = "chat does not exist" };

            if (chat.Type == 3)
            {
                return await GetDecryptedMessagesAsync(user, chat);
            }
            if (!await context.UserChatRelationship.Where(x => x.ChatId == chatId && x.UserId == userId).AnyAsync())
                return new ServiceResult { Success = false, ErrorMessage = "user not in chat" };

            var messages = await context.Message.Where(x => x.ChatId == chatId).ToListAsync();
            return new ServiceResult { Success = true, Data = messages };
        }

        public async Task<ServiceResult> GetDecryptedMessagesAsync(User user, Chat chat)
        {
            var privateChat = await context.PrivateChat.FindAsync(chat.ChatId);
            if (privateChat is null)
                return new ServiceResult { Success = false, ErrorMessage = "chat does not exist in 'PrivateChat' table" };
            var messages = await context.Message.Where(m => m.ChatId == chat.Id).ToListAsync();
            var otherUserId = privateChat.GetOtherUser(user.Id);

            foreach (var msg in messages)
            {
                if (msg.UserId == otherUserId)
                {
                    try
                    {
                        msg.Content = DecryptMessage(msg, user);
                    }
                    catch
                    {
                        msg.Content = "[decryption error]";
                    }
                }
                else
                {
                    try
                    {
                        msg.Content = DecryptOwnMessage(msg, user);
                    }
                    catch
                    {
                        msg.Content = "[decryption error]";
                    }
                }
            }

            return new ServiceResult { Success = true, Data = messages };
        }

        public async Task<ServiceResult> DeleteMessageAsync(int userId, int messageId)
        {
            var user = await context.User.FindAsync(userId);
            if (user is null)
                return new ServiceResult { Success = false, ErrorMessage = "user does not exist" };
            var msg = await context.Message.FindAsync(messageId);
            if (msg is null)
                return new ServiceResult { Success = false, ErrorMessage = "message does not exist" };

            if (userId != msg.UserId && !user.IsAdmin)
                return new ServiceResult { Success = false, ErrorMessage = "don't have permission" };

            context.Message.Remove(msg);
            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = msg };
        }

        private string DecryptMessage(Message message, User user)
        {
            using (var rsa = RSA.Create())
            {
                rsa.ImportPkcs8PrivateKey(Convert.FromBase64String(user.PrivateKey), out _);

                byte[] encryptedBytes = Convert.FromBase64String(message.Content);
                byte[] decryptedBytes = rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.OaepSHA256);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
        }
        private string DecryptOwnMessage(Message message, User user)
        {
            using (var rsa = RSA.Create())
            {
                rsa.ImportPkcs8PrivateKey(Convert.FromBase64String(user.PrivateKey), out _);

                byte[] encryptedBytes = Convert.FromBase64String(message.SelfContent);
                byte[] decryptedBytes = rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.OaepSHA256);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
        }
    }
}
