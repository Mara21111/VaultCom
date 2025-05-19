using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using System.Text.RegularExpressions;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services.Implementations
{
    public class MessageService : IMessageService
    {
        private readonly MyContext context;

        public MessageService(MyContext context)
        {
            this.context = context;
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
                Time = DateTime.Now, // todle se nekde posere
                IsEdited = false,
                IsPinned = false,
                PreviousMessageId = dto.ReplyMessageId.HasValue ? dto.ReplyMessageId.Value : 0,
            };

            context.Message.Add(msg);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = msg };
        }

        public async Task<ServiceResult> GetMessagesByChatAsync(int id)
        {
            var messages = await context.Message.Where(x => x.ChatId == id).ToListAsync();
            return new ServiceResult { Success = true, Data = messages };
        }
    }
}
