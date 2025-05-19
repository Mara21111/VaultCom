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
        public object MapUserToDTO(int id)
        {
            var user = context.User.Find(id);
            if (user.IsPublic)
            {
                return new PublicUserDataDTO
                {
                    Username = user.Username,
                    Bio = user.Bio,
                    CreatedAt = user.CreatedAt,
                    TimeoutEnd = user.TimeoutEnd,
                    BanEnd = user.BanEnd,
                    Email = user.Email,
                    SafeMode = user.SafeMode,
                };
            }
            else
            {
                return new BaseUserDataDTO
                {
                    Username = user.Username,
                    Bio = user.Bio,
                    CreatedAt = user.CreatedAt,
                    TimeoutEnd = user.TimeoutEnd,
                    BanEnd = user.BanEnd
                };
            }
        }

        public async Task<ServiceResult> CreateUserChatRelationAsync(UserChatRelationDTO dto)
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
            var userIds = await context.UserChatRelationship
                .Where(x => x.ChatId == id)
                .Select(x => x.UserId).ToListAsync();
            var userDTO = userIds.Select(MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data =  userDTO };
        }

        public async Task<ServiceResult> JoinPublicChatAsync(UserChatRelationDTO dto)
        {
            return await CreateUserChatRelationAsync(dto);
        }
    }
}
