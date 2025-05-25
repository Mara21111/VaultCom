using System.Linq;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services.Implementations
{
    public class PrivateChatService : IPrivateChatService
    {
        private readonly MyContext context;
        private readonly IChatService _chatService;

        public PrivateChatService(MyContext context, IChatService chatService, IUserChatRelationshipService userChatRelationshipService)
        {
            this.context = context;
            _chatService = chatService;
        }

        public async Task<bool> ChatExists(UserRelationshipDTO dto)
        {
            return await context.PrivateChat.Where(x =>
            (x.UserAId == dto.RequestorId && x.UserBId == dto.TargetId) ||
            (x.UserAId == dto.TargetId && x.UserBId == dto.RequestorId)).AnyAsync();
        }

        public async Task<ServiceResult> CreatePrivateChatAsync(UserRelationshipDTO dto)
        {
            if (dto.RequestorId == dto.TargetId)
                return new ServiceResult { Success = false, ErrorMessage = "cannot message yourself" };
            if (await ChatExists(dto))
                return new ServiceResult { Success = false, ErrorMessage = "chat already exists" };
            var rel = await context.UserRelationship.Where(x => x.SenderId == dto.RequestorId && x.RecieverId == dto.TargetId).FirstOrDefaultAsync();
            if (rel is not null && rel.IsBlocked)
                return new ServiceResult { Success = false, ErrorMessage = "user is blocked" };

            var privateChat = new PrivateChat
            {
                UserAId = dto.RequestorId,
                UserBId = dto.TargetId
            };
            context.PrivateChat.Add(privateChat);
            await context.SaveChangesAsync();

            await _chatService.CreateChat(new CreateChatDTO
            {
                Type = 3,
                Id = privateChat.Id
            });

            return new ServiceResult { Success = true, Data = privateChat };
        }

        public async Task<ServiceResult> GetPrivateChatUserIds(int id)
        {
            var chat = await context.Chat.FindAsync(id);
            var pc = await context.PrivateChat.FindAsync(chat!.ChatId);

            return new ServiceResult { Success = true, Data = new List<int> { pc!.UserAId, pc!.UserBId } };
        }

        public async Task<ServiceResult> GetPrivateChatUsers(int id)
        {
            List<int> users = (List<int>)GetPrivateChatUserIds(id).Result.Data!;

            return new ServiceResult { Success = true, Data = new List<User> 
            { 
                await context.User.FindAsync(users[0]),
                await context.User.FindAsync(users[1])
            } };
        }
    }
}
