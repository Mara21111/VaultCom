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
    public class ChatService : IChatService
    {
        private readonly MyContext context;

        public ChatService(MyContext context)
        {
            this.context = context;
        }
        /*public async Task<ServiceResult> CreatePublicChatAsync(CreatePublicChatDTO dto)
        {
            if (!context.User.Find(dto.CreatorId).IsAdmin)
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
                Creator_Id = dto.CreatorId,
                Description = dto.Desc,
                Is_Public = true
            };

            context.Chat.Add(chat);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = dto };
        }

        public async Task<ServiceResult> CreateGroupChatAsync(CreateGroupChatDTO dto)
        {
            var chat = new Chat
            {
                Name = dto.Title,
                Creator_Id = dto.CreatorId,
                Is_Public = false,
                Description = ""
            };

            context.Chat.Add(chat);
            await context.SaveChangesAsync();

            // spojit je s userchat propojenim

            return new ServiceResult { Success = true, Data = dto };
        }

        public async Task<ServiceResult> GetChats(ChatFilterDTO? dto)
        {
            IQueryable<Chat> query = context.Chat;

            if (dto is not null)
            {
                if (dto.IsPublic.HasValue)
                    query = query.Where(x => x.Is_Public == dto.IsPublic);
                if (dto.IsIn.HasValue && dto.RequestorId.HasValue)
                {
                    List<int> chat_ids = context.User_Chat.Where(x => x.UserId == dto.RequestorId).Select(x => x.ChatId).ToList();
                    query = query.Where(x => chat_ids.Contains(x.Id));
                }
            }

            var users = await query.ToListAsync();

            return new ServiceResult { Success = true, Data = users };
        }*/
    }
}
