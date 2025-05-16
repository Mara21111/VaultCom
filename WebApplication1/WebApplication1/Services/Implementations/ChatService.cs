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


       /* public async Task<List<ChatGetterDTO>> GetChatGetterDTOsAsync(IQueryable<Chat> query)
        {
            var chatGetterDTOs = await query
    .Select(chat => new ChatGetterDTO
    {
        Id = chat.Id,
        Title = chat.Type == 1
            ? (from pc in context.PublicChat
               where pc.Id == chat.ChatId
               select pc.Title).FirstOrDefault() ?? "Public Chat"
            : chat.Type == 2
                ? (from gc in context.GroupChat
                   where gc.Id == chat.ChatId
                   select gc.Title).FirstOrDefault() ?? "Group Chat"
                : chat.Type == 3
                    ? (from ur in context.UserRelationship
                       where ur.User_Id == chat.Id
                       select ur.Nickname).FirstOrDefault() ?? "Private DM"
                    : "Unknown Chat"
    })
    .ToListAsync();

            return chatGetterDTOs;
        }*/

        /*private async Task<object?> MapChatsAsync(Chat chat)
        {
            if (chat.IsPublic)
            {
                var publicChat = await context.PublicChat.FindAsync(chat.ChatId);
                return publicChat;
            }
            else
            {
                var groupChat = await context.GroupChat.FindAsync(chat.ChatId);
                return groupChat;
            }
        }*/

        public async Task<ServiceResult> CreateChat(CreateChatDTO dto)
        {
            context.Chat.Add(new Chat { Type = dto.Type, ChatId = dto.Id });
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = dto };
        }

        private async Task<ChatGetterDTO> MapChatToDTO(Chat chat, MyContext context)
        {
            string title = chat.Type switch
            {
                1 => (await context.PublicChat.FindAsync(chat.ChatId)).Title,
                2 => (await context.GroupChat.FindAsync(chat.ChatId)).Title,
                _ => (await context.PrivateChat.FindAsync(chat.ChatId)).UserAId.ToString()
            };

            return new ChatGetterDTO
            {
                Title = title,
                Id = chat.Id
            };
        }

        public async Task<ServiceResult> GetChatsAsync(ChatFilterDTO? filter = null)
        {
            IQueryable<Chat> query = context.Chat;

            if (filter != null)
            {
                //logic here
            }

            var chats = await query.ToListAsync();

            var chatDTOs = new List<ChatGetterDTO>();
            foreach (var chat in chats)
            {
                var dto = await MapChatToDTO(chat, context);
                chatDTOs.Add(dto);
            }

            return new ServiceResult { Success = true, Data = chatDTOs };
        }


        /*public async Task<ServiceResult> GetChatsAsync(ChatFilterDTO? filter = null)
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
                        query = query.Where(x => x.Type == 1 && !context.UserChatRelationship
                        .Any(r => r.UserId == requestorId && r.ChatId == x.Id));

                    if (filter.IsMuted.HasValue)
                        query = query.Where(x => context.UserChatRelationship
                        .Any(r => r.UserId == requestorId && r.ChatId == x.Id && r.MutedChat == filter.IsMuted.Value));
                }
                if (filter.Type.HasValue)
                    query = query.Where(x => x.Type == filter.Type.Value);
            }

            var chats = await query.ToListAsync();
            //var mappedChats = chats.Select(MapChatsAsync).ToList();
            var result = GetChatGetterDTOsAsync(query);

            return new ServiceResult { Success = true, Data = result };
        }*/
    }
}
