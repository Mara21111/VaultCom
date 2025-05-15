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
        private readonly IUserChatRelationshipService _userChatRelationshipService;

        public PublicChatService(MyContext context, IChatService chatService, IUserChatRelationshipService userChatRelationshipService)
        {
            this.context = context;
            _chatService = chatService;
            _userChatRelationshipService = userChatRelationshipService;
        }

        public async Task<ServiceResult> CreatePublicChatAsync(CreatePublicChatDTO dto)
        {
            var creator = await context.User.FindAsync(dto.CreatorId);
            if (creator == null || !creator.IsAdmin)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User is not admin", ErrorCode = 403 };
            }

            if (await context.PublicChat.AnyAsync(x => x.Title == dto.Title))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Public chat already exists", ErrorCode = 409 };
            }

            var publicChat = new PublicChat
            {
                Title = dto.Title,
                Description = dto.Desc
            };

            context.PublicChat.Add(publicChat);
            await context.SaveChangesAsync();

            await _chatService.CreateChat(new CreateChatDTO
            {
                IsPublic = true,
                Id = publicChat.Id
            });
            var baseChat = await context.Chat.OrderByDescending(x => x.Id).FirstOrDefaultAsync();

            List<int> admins = await context.User.Where(x => x.IsAdmin).Select(x => x.Id).ToListAsync();
            foreach (var admin in admins)
            {
                await _userChatRelationshipService.CreateUserChatRelationAsync(new UserChatRelationDTO
                {
                    UserId = admin,
                    ChatId = baseChat.Id
                });
            }

            return new ServiceResult { Success = true, Data = dto };
        }
    }
}
