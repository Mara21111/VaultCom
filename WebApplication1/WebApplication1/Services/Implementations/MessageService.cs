using Google.Protobuf;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Crmf;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.Crypto;
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
            return Regex.IsMatch(content, @"https?:\/\/[^\s/$.?#].[^\s]*");
            return Regex.IsMatch(content, @"^(https?://)?www(\.[a-zA-Z0-9]{2,})+(/[a-zA-Z0-9_\-/]*)?$");
        }

        public async Task<ServiceResult> EditMessageAsync(MessageEditDTO dto)
        {
            var msg = await context.Message.FindAsync(dto.MessageId);
            if (dto.NewContent is not null && dto.NewContent.Length > 0 && msg!.UserId != dto.UserId)
                return new ServiceResult { Success = false, ErrorMessage = "cannot edit other message" };

            var chat = await context.Chat.FindAsync(msg.ChatId);
            var user = await context.User.FindAsync(dto.UserId);
            if (dto.Pin.HasValue)
            {
                if (chat?.Type == 1 && user!.IsAdmin)
                    msg.IsPinned = !msg.IsPinned;
                else if (chat?.Type != 1)
                    msg.IsPinned = !msg.IsPinned;
                else
                    return new ServiceResult { Success = false, ErrorMessage = "could not pin the message" };
            }
            if (dto.NewContent != null && dto.NewContent.Length > 0)
            {
                if (chat!.Type == 3)
                {
                    var pc = await context.PrivateChat.FindAsync(chat.ChatId);
                    var otherUser = await pc!.GetOtherUser(context, user!.Id);

                    using (RSA rsa = RSA.Create())
                    {
                        byte[] messageBytes = Encoding.UTF8.GetBytes(msg.Content);

                        msg.Content = EncryptBytes(messageBytes, otherUser.PublicKey, rsa);
                        msg.SelfContent = EncryptBytes(messageBytes, user.PublicKey, rsa);
                    }
                }
                else
                {
                    msg.Content = dto.NewContent;
                }   
            }

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = msg };
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
            var chat = await context.Chat.FindAsync(dto.ChatId);
            var pc = await context.PrivateChat.FindAsync(chat!.ChatId);
            if (pc == null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "chat not found" };
            }

            var user = await context.User.FindAsync(dto.UserId);
            var otherUser = await pc.GetOtherUser(context, dto.UserId);

            try
            {
                using (RSA rsa = RSA.Create())
                {
                    byte[] messageBytes = Encoding.UTF8.GetBytes(msg.Content);

                    msg.Content = EncryptBytes(messageBytes, otherUser.PublicKey, rsa);
                    msg.SelfContent = EncryptBytes(messageBytes, user!.PublicKey, rsa);
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

        private string EncryptBytes(byte[] msg, string key, RSA rsa)
        {
            rsa.ImportSubjectPublicKeyInfo(Convert.FromBase64String(key), out _);
            byte[] encrypted = rsa.Encrypt(msg, RSAEncryptionPadding.OaepSHA256);
            return Convert.ToBase64String(encrypted);
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
            var otherUserId = privateChat.GetOtherUserId(user.Id);

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
            var chat = await context.Chat.FindAsync(msg.ChatId);
            var gc = await context.GroupChat.Where(x => x.Id == chat!.ChatId).FirstOrDefaultAsync();
            if (userId != msg.UserId && 
                ((chat!.Type == 1 && !user.IsAdmin) ||
                (chat!.Type == 2 && gc!.OwnerId != userId)))
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

                byte[] encryptedBytes = Convert.FromBase64String(message.SelfContent!);
                byte[] decryptedBytes = rsa.Decrypt(encryptedBytes, RSAEncryptionPadding.OaepSHA256);
                return Encoding.UTF8.GetString(decryptedBytes);
            }
        }
    }
}
