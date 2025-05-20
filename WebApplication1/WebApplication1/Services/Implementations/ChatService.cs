using System;
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
        private readonly IUserService _userService;

        public ChatService(MyContext context, IUserService userService)
        {
            this.context = context;
            this._userService = userService;
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


        public async Task<ServiceResult> CreateChat(CreateChatDTO dto)
        {
            context.Chat.Add(new Chat { Type = dto.Type, ChatId = dto.Id });
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = dto };
        }

        public async Task<ServiceResult> GetChatsAsync(ChatFilterDTO? filter = null)
        {
            IQueryable<Chat> query = context.Chat;

            if (filter != null)
            {
                if (filter.IsIn.HasValue)
                {
                    var chatsIn = await context.UserChatRelationship
                        .Where(x => x.UserId == filter.RequestorId)
                        .Select(x => x.ChatId).ToListAsync();
                    query = query.Where(x => chatsIn.Contains(x.Id) == filter.IsIn.Value);
                }

                if (filter.IsMuted.HasValue)
                {
                    var chatsMuted = await context.UserChatRelationship
                        .Where(x => x.UserId == filter.RequestorId && x.MutedChat == filter.IsMuted.Value)
                        .Select(x => x.ChatId).ToListAsync();
                    query = query.Where(x => chatsMuted.Contains(x.Id));
                }

                if (filter.Type.HasValue)
                    query = query.Where(x => x.Type == filter.Type.Value);
            }

            var chats = await query.ToListAsync();

            var chatDTOs = new List<ChatGetterDTO>();
            foreach (var chat in chats)
                chatDTOs.Add(await MapChatToDTO(chat, context));

            if (filter?.Prompt != null && filter.Prompt.Any())
                chatDTOs = chatDTOs
                    .Where(dto => filter.Prompt.Any(p => dto.Title?.Contains(p, StringComparison.OrdinalIgnoreCase) == true))
                    .ToList();

            return new ServiceResult { Success = true, Data = chatDTOs };
        }

        public async Task<ServiceResult> GetPublicChatsAsync()
        {
            var chatIds = await context.PublicChat.Select(x => x.Id).ToListAsync();
            List<PublicChatGetterDTO> chatsDTO = new List<PublicChatGetterDTO>();

            for (int i = 0; i < await context.PublicChat.CountAsync(); i++)
            {
                var chat = context.PublicChat.FindAsync(chatIds[i]).Result;
                var usersInChat = await context.UserChatRelationship.Where(x => x.ChatId == chat.Id).Select(x => x.UserId).ToListAsync();
                chatsDTO.Add(new PublicChatGetterDTO
                {
                    Id = chat.Id,
                    Title = chat.Title,
                    Users = usersInChat.Count(),
                    ActiveUers = usersInChat.Where(x => _userService.IsUserOnlineAsync(x).Result.IsActive).Count()
                });
            }

            return new ServiceResult { Success = true, Data = chatsDTO };
        }
    }
}
