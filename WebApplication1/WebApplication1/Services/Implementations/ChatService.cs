using System.Linq;
using Microsoft.EntityFrameworkCore;
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

        public async Task<ServiceResult> CreateChat(CreateChatDTO dto)
        {
            if (!await context.GroupChat.AnyAsync(x => x.Id == dto.Id))
            {
                return new ServiceResult { Success = false, ErrorMessage = "ChatId does not exist in GroupChat table" };
            }
            context.Chat.Add(new Chat { IsPublic = dto.IsPublic, ChatId = dto.Id });
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = dto };
        }

        public async Task<ServiceResult> GetChatsAsync(ChatFilterDTO? filter = null)
        {
            IQueryable<Chat> query = context.Chat;

            if (filter is not null)
            {
                if (filter.IsIn.HasValue && filter.RequestorId.HasValue)
                {
                    int requestorId = filter.RequestorId.Value;
                    if (filter.IsIn.Value)
                        query = query.Where(x => context.UserChatRelationship
                        .Any(r => r.UserId == requestorId && r.ChatId == x.Id));
                    else
                        query = query.Where(x => x.IsPublic && !context.UserChatRelationship
                        .Any(r => r.UserId == requestorId && r.ChatId == x.Id));

                    if (filter.IsMuted.HasValue)
                        query = query.Where(x => context.UserChatRelationship
                        .Any(r => r.UserId == requestorId && r.ChatId == x.Id && r.MutedChat == filter.IsMuted.Value));
                }
                if (filter.IsPublic.HasValue)
                    query = query.Where(x => x.IsPublic);
            }

            var chats = await query.ToListAsync();

            return new ServiceResult { Success = true, Data = chats };
        }
    }
}
