using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
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
            if (!context.UserChatRelationship.Where(x => x.ChatId == dto.ChatId && x.UserId == dto.UserId).Any())
            {
                return new ServiceResult { Success = false, ErrorMessage = "User is not in chat", ErrorCode = 404 };
            }

            var msg = new Message
            {
                UserId = dto.UserId,
                ChatId = dto.ChatId,
                Content = dto.Content,
                URLLink = IsLinkRegex(dto.Content) ? dto.Content : "",
                Time = DateTime.Now,
                IsEdited = false,
                IsPinned = false,
                PreviousMessageId = dto.ReplyMessageId.HasValue ? dto.ReplyMessageId.Value : 0,
            };

            if (context.Chat.Find(dto.ChatId).Type == 3)
            {
                return await SendEncryptedMessageAsync(dto, msg);
            }

            context.Message.Add(msg);
            await context.SaveChangesAsync();

            await _userService.SetActivityAsync(dto.UserId);

            return new ServiceResult { Success = true, Data = msg };
        }

        public async Task<ServiceResult> SendEncryptedMessageAsync(MessageDTO dto, Message msg)
        {
            PrivateChat chat = await context.PrivateChat.FindAsync(context.Chat.Find(dto.ChatId).ChatId);

            // todo
            /*using (var rsa = RSA.Create())
            {
                var otherUser = await context.User.FindAsync(chat.GetOtherUser(dto.UserId));
                rsa.FromXmlString(otherUser.PublicKey);
                byte[] data = Encoding.UTF8.GetBytes(msg.Content);
                msg.Content = rsa.Encrypt(data, RSAEncryptionPadding.Pkcs1);
            }*/

            return new ServiceResult { Success = true, Data = chat };
        }

        public async Task<ServiceResult> GetMessagesByChatAsync(int id)
        {
            var messages = await context.Message.Where(x => x.ChatId == id).ToListAsync();
            return new ServiceResult { Success = true, Data = messages };
        }
    }
}
