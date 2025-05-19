using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.Ocsp;
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

        public async Task<UserRelationship> CreateEmptyRelAsync(UserRelationshipDTO dto)
        {
            return new UserRelationship
            {
                SenderId = dto.RequestorId,
                RecieverId = dto.TargetId,
                Pending = false,
                IsFriend = false,
                IsBlocked = false,
                IsMuted = false,
                Nickname = context.User.Find(dto.TargetId).Username
            };
        }

        public async Task<ServiceResult> SendFriendRequestAsync(UserRelationshipDTO dto)
        {
            if (dto.RequestorId == dto.TargetId)
            {
                return new ServiceResult { Success = false, ErrorMessage = "cannot send request to yourself", ErrorCode = 404 };
            }

            UserRelationship? rel;
            if (!context.UserRelationship
                .Where(x => x.SenderId == dto.RequestorId && x.RecieverId == dto.TargetId).Any())
            {
                rel = await CreateEmptyRelAsync(dto);
                rel.Pending = true;
                context.UserRelationship.Add(rel);
            }
            else
            {
                rel = await context.UserRelationship
                .Where(x => x.SenderId == dto.RequestorId && x.RecieverId == dto.TargetId)
                .FirstOrDefaultAsync();

                if (rel.IsFriend)
                {
                    return new ServiceResult { Success = false, ErrorMessage = "bad request", ErrorCode = 404 };
                }
                rel.Pending = true;
            }

            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = rel };
        }

        public async Task<ServiceResult> AcceptFriendRequestAsync(UserRelationshipDTO dto)
        {
            if (dto.RequestorId == dto.TargetId)
            {
                return new ServiceResult { Success = false, ErrorMessage = "bad request", ErrorCode = 404 };
            }

            UserRelationship rel = await context.UserRelationship
                .Where(x => x.SenderId == dto.RequestorId && x.RecieverId == dto.TargetId)
                .FirstOrDefaultAsync();

            if (!rel.Pending)
            {
                return new ServiceResult { Success = false, ErrorMessage = "not pending", ErrorCode = 404 };
            }

            rel.IsFriend = true;
            rel.Pending = false;

            UserRelationship? rel2;
            if (!context.UserRelationship
                .Where(x => x.SenderId == dto.TargetId && x.RecieverId == dto.RequestorId).Any())
            {
                rel2 = await CreateEmptyRelAsync(dto.Reverse());
                rel2.IsFriend = true;
                context.UserRelationship.Add(rel2);
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

            return new ServiceResult { Success = true, Data = userDTOs };
        }

        public async Task<ServiceResult> GetOutcomingFriendRequestsAsync(int id)
        {
            var users = await context.UserRelationship
                .Where(x => x.SenderId == id && x.Pending)
                .Select(x => x.RecieverId).ToListAsync();
            var userDTOs = users.Select(_UCRService.MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data = userDTOs };
        }

        public async Task<ServiceResult> GetFriendsAsync(int id)
        {
            var users = await context.UserRelationship
                .Where(x => x.SenderId == id && x.IsFriend)
                .Select(x => x.RecieverId).ToListAsync();
            var userDTOs = users.Select(_UCRService.MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data = userDTOs };
        }
    }
}
