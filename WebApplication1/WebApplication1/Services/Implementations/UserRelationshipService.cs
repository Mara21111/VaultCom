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
    public class UserRelationshipService : IUserRelationshipService
    {
        private readonly MyContext context;
        private readonly IUserChatRelationshipService _UCRService;

        public UserRelationshipService(MyContext context, IUserChatRelationshipService UCRService)
        {
            this.context = context;
            _UCRService = UCRService;
        }

        public async Task<ServiceResult> SendFriendRequestAsync(RequestDTO dto)
        {
            UserRelationship? rel;
            if (!context.UserRelationship
                .Where(x => x.SenderId == dto.RequestorId && x.RecieverId == dto.TargetId).Any())
            {
                rel = new UserRelationship
                {
                    SenderId = dto.RequestorId,
                    RecieverId = dto.RequestorId,
                    Pending = true,
                    IsFriend = false,
                    IsBlocked = false,
                    IsMuted = false,
                    Nickname = context.User.Find(dto.TargetId).Username
                };
                context.UserRelationship.Add(rel);
            }
            else
            {
                rel = await context.UserRelationship
                .Where(x => x.SenderId == dto.RequestorId && x.RecieverId == dto.TargetId)
                .FirstOrDefaultAsync();

                if (rel.IsFriend)
                {
                    return new ServiceResult { Success = false, ErrorMessage = "users are friends already", ErrorCode = 404 };
                }
                rel.Pending = true;
            }

            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = rel };
        }

        public async Task<ServiceResult> GetIncomingFriendRequestsAsync(int id)
        {
            var users = await context.UserRelationship
                .Where(x => x.RecieverId == id && x.Pending)
                .Select(x => x.SenderId).ToListAsync();
            var userDTOs = users.Select(_UCRService.MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data = users };
        }

        public async Task<ServiceResult> GetOutcomingFriendRequestsAsync(int id)
        {
            var users = await context.UserRelationship
                .Where(x => x.SenderId == id && x.Pending)
                .Select(x => x.RecieverId).ToListAsync();
            var userDTOs = users.Select(_UCRService.MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data = users };
        }

        public async Task<ServiceResult> GetFriendsAsync(int id)
        {
            var users = await context.UserRelationship
                .Where(x => x.SenderId == id && x.IsFriend)
                .Select(x => x.RecieverId).ToListAsync();
            var userDTOs = users.Select(_UCRService.MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data = users };
        }
    }
}
