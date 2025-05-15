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

        public UserChatRelationshipService(MyContext context)
        {
            this.context = context;
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
    }
}
