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
    public class UserChatRelationshipService : IUserChatRelationshipService
    {
        private readonly MyContext context;
        private readonly IUserService _userService;

        public UserChatRelationshipService(MyContext context, IUserService userService)
        {
            this.context = context;
            _userService = userService;
        }
        public async Task<ServiceResult> CreateUserChatRelationAsync(UserChatRelationshipDTO dto)
        {
            var rel = new UserChatRelationship
            {
                ChatId = dto.ChatId,
                UserId = dto.UserId,
                MutedChat = false
            };

            context.UserChatRelationship.Add(rel);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = dto };
        }
        public async Task<ServiceResult> GetUsersInChatAsync(int id)
        {
            var chat = await context.Chat.FindAsync(id);
            List<User> users = new List<User>();
            if (chat!.Type == 3)
            {
                var pc = await context.PrivateChat.FindAsync(chat!.ChatId);
                users = await pc.GetUsers(context);
            }
            else
            {
                var userIds = await context.UserChatRelationship
                    .Where(x => x.ChatId == id)
                    .Select(x => x.UserId).ToListAsync();
                users = await context.User.Where(u => userIds.Contains(u.Id)).ToListAsync();
            }

            return new ServiceResult { Success = true, Data = users.Select(_userService.MapUserToDTO).ToList() };
        }

        public async Task<ServiceResult> JoinPublicChatAsync(UserChatRelationshipDTO dto)
        {
            return await CreateUserChatRelationAsync(dto);
        }

        public async Task<ServiceResult> LeaveChatAsync(UserChatRelationshipDTO dto)
        {
            UserChatRelationship? rel = await context.UserChatRelationship.Where(x => x.UserId == dto.UserId && x.ChatId == dto.ChatId).FirstAsync();
            if (rel is null)
            {
                return new ServiceResult { Success = true, ErrorMessage = "user is not joined in chat" };
            }

            context.UserChatRelationship.Remove(rel);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = rel };
        }

        public async Task<ServiceResult> MuteChatToggleAsync(UserChatRelationshipDTO dto)
        {
            UserChatRelationship? rel = await context.UserChatRelationship.Where(x => x.UserId == dto.UserId && x.ChatId == dto.ChatId).FirstAsync();
            if (rel is null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "user not in chat", ErrorCode = 404 };
            }

            rel.MutedChat = !rel.MutedChat;
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = rel };
        }
    }
}
