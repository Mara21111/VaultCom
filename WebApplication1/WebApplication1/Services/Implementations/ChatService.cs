using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services.Implementations
{
    public class ChatService : IChatService
    {
        private readonly MyContext context;

        public ChatService(MyContext context)
        {
            this.context = context;
        }

        public async Task<ServiceResult> CreateChatAsync(CreateChatDTO dto)
        {
            if (!context.User.Find(dto.CreatorId).Is_Admin)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User is not admin", ErrorCode = 403 };
            }
            if (context.Chat.Where(x => x.Name == dto.Title).Any())
            {
                return new ServiceResult { Success = false, ErrorMessage = "Public chat already exists", ErrorCode = 409 };
            }

            var chat = new Chat
            {
                Name = dto.Title,
                Description = dto.Desc,
                Creator_Id = dto.CreatorId,
                Is_Public = true
            };

            context.Chat.Add(chat);
            await context.SaveChangesAsync();
            // spojit je s userchat propojenim

            return new ServiceResult { Success = true, Data = dto };
        }
    }
}
