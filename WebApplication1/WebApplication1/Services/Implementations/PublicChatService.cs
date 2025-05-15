using System.Linq;
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
    public class PublicChatService : IPublicChatService
    {
        private readonly MyContext context;
        private readonly IChatService _chatService;

        public PublicChatService(MyContext context, IChatService chatService)
        {
            this.context = context;
            _chatService = chatService;
        }

        public async Task<ServiceResult> CreatePublicChatAsync(CreatePublicChatDTO dto)
        {
            var user = await context.User.FindAsync(dto.CreatorId);
            if (user == null || !user.IsAdmin)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User is not admin", ErrorCode = 403 };
            }

            if (await context.PublicChat.AnyAsync(x => x.Title == dto.Title))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Public chat already exists", ErrorCode = 409 };
            }

            var chat = new PublicChat
            {
                Title = dto.Title,
                Description = dto.Desc
            };

            context.PublicChat.Add(chat);
            await context.SaveChangesAsync();

            await _chatService.CreateChat(new CreateChatDTO
            {
                IsPublic = true,
                Id = chat.Id
            });

            return new ServiceResult { Success = true, Data = dto };
        }
    }
}
