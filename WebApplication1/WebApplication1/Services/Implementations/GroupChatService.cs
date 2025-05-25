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
using ZstdSharp.Unsafe;

namespace WebApplication1.Services.Implementations
{
    public class GroupChatService : IGroupChatService
    {
        private readonly MyContext context;
        private readonly IChatService _chatService;
        private readonly IUserChatRelationshipService _userChatRelationshipService;

        public GroupChatService(MyContext context, IChatService chatService, IUserChatRelationshipService userChatRelationshipService)
        {
            this.context = context;
            _chatService = chatService;
            _userChatRelationshipService = userChatRelationshipService;
        }

        public async Task<ServiceResult> CreateGroupChatAsync(CreateGroupChatDTO dto)
        {
            var gc = new GroupChat
            {
                Title = dto.Title,
                OwnerId = dto.CreatorId
            };

            context.GroupChat.Add(gc);
            await context.SaveChangesAsync();

            await _chatService.CreateChat(new CreateChatDTO
            {
                Type = 2,
                Id = gc.Id
            });

            var baseChat = await context.Chat.OrderByDescending(x => x.Id).FirstOrDefaultAsync();

            await _userChatRelationshipService.CreateUserChatRelationAsync(new UserChatRelationshipDTO
            {
                UserId = dto.CreatorId,
                ChatId = baseChat.Id
            });

            foreach (var chatId in dto.ChatIds)
            {
                var pc = await context.PrivateChat.FindAsync(chatId);
                await _userChatRelationshipService.CreateUserChatRelationAsync(new UserChatRelationshipDTO
                {
                    UserId = pc.GetOtherUser(dto.CreatorId),
                    ChatId = baseChat.Id
                });
            }

            return new ServiceResult { Success = true, Data = dto };
        }
    }
}
