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
        private readonly IMessageService _messageService;

        public ChatService(MyContext context, IUserService userService, IMessageService messageService)
        {
            this.context = context;
            _userService = userService;
            _messageService = messageService;
        }


        private async Task<ChatGetterDTO> MapChatToDTO(Chat chat, MyContext context, int userId)
        {
            string title = "";
            string chatType = "";
            int? ownerId = null;
            int unread = 0;

            var allInfos = await context.MessageInfo.Where(x => x.ChatId == chat.Id && x.UserId == userId).ToListAsync();
            var lastMsgInfoSeen = await context.MessageInfo.Where(x => x.ChatId == chat.Id && x.UserId == userId).FirstOrDefaultAsync();
            var messages = (List<Message>)(await _messageService.GetMessagesInChatAsync(userId, chat.Id, false)).Data!;
            if (lastMsgInfoSeen is not null)
            {
                var lastMsgSeen = await context.Message.FindAsync(lastMsgInfoSeen!.MessageId);
                unread = messages.Count(x => x.Time > lastMsgSeen!.Time);
            }
            else
            {
                if (messages is null)
                    unread = 0;
                else
                    unread = messages.Count();
            }

            if (chat.Type == 1)
            {
                title = (await context.PublicChat.FindAsync(chat.ChatId))!.Title;
                chatType = "Public";
            }
            if (chat.Type == 2)
            {
                var gc = await context.GroupChat.FindAsync(chat.ChatId);
                title = gc!.Title;
                ownerId = gc!.OwnerId;
                chatType = "Group";
            }
            if (chat.Type == 3)
            {
                var pc = await context.PrivateChat.FindAsync(chat.ChatId);
                var otherUserId = pc!.GetOtherUserId(userId);
                var rel = await context.UserRelationship
                    .Where(x => x.SenderId == userId && x.RecieverId == otherUserId).FirstOrDefaultAsync();
                if (rel is not null)
                    title = rel.Nickname;
                else
                    title = (await context.User.FindAsync(otherUserId))!.Username;
                chatType = "Private";
            }

            return new ChatGetterDTO
            {
                Title = title,
                Id = chat.Id,
                OwnerId = ownerId,
                ChatType = chatType,
                UnreadMessages = unread
            };
        }


        public async Task<ServiceResult> CreateChat(CreateChatDTO dto)
        {
            context.Chat.Add(new Chat { Type = dto.Type, ChatId = dto.Id });
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = dto };
        }

        public async Task<ServiceResult> GetChatsAsync(ChatFilterDTO filter)
        {
            IQueryable<Chat> query = context.Chat;

            if (filter is not null)
            {
                if (filter.IsIn.HasValue)
                {
                    // clean ts up
                    var chatsIn = await context.UserChatRelationship
                        .Where(x => x.UserId == filter.RequestorId)
                        .Select(x => x.ChatId).ToListAsync();

                    var privateChatsIn = context.PrivateChat.AsEnumerable()
                        .Where(x => x.UserInChat(filter.RequestorId))
                        .Select(x => x.Id).ToList();

                    var privateIds = await context.Chat
                        .Where(x => privateChatsIn.Contains(x.ChatId))
                        .Select(x => x.Id).ToListAsync();
                    
                    chatsIn.AddRange(privateIds);

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
            {
                chatDTOs.Add(await MapChatToDTO(chat, context, filter.RequestorId));
            }

            if (filter?.Prompt != null && filter.Prompt.Any())
                chatDTOs = chatDTOs
                    .Where(dto => filter.Prompt.Any(x => dto.Title?.Contains(x, StringComparison.OrdinalIgnoreCase) == true))
                    .ToList();

            return new ServiceResult { Success = true, Data = chatDTOs };
        }

        public async Task<ServiceResult> GetPublicChatsAsync()
        {
            var pcIds = await context.PublicChat.Select(x => x.Id).ToListAsync();
            var chatIds = await context.Chat.Where(x => pcIds.Contains(x.ChatId)).Select(x => x.Id).ToListAsync();
            List<PublicChatGetterDTO> chatsDTO = new List<PublicChatGetterDTO>();

            for (int i = 0; i < await context.PublicChat.CountAsync(); i++)
            {
                var chat = await context.Chat.FindAsync(chatIds[i]);
                var pc = await context.PublicChat.FindAsync(pcIds[i]);
                var usersInChat = await context.UserChatRelationship.Where(x => x.ChatId == chat!.Id).Select(x => x.UserId).ToListAsync();
                chatsDTO.Add(new PublicChatGetterDTO
                {
                    Id = chat!.Id,
                    Title = pc!.Title,
                    Users = usersInChat.Count(),
                    ActiveUsers = usersInChat.Where(x => _userService.IsUserOnlineAsync(x).Result.IsActive).Count(),
                    Description = pc.Description
                });
            }

            return new ServiceResult { Success = true, Data = chatsDTO };
        }

        public async Task<ServiceResult> DeleteChatAsync(UserChatRelationshipDTO dto)
        {
            var user = await context.User.FindAsync(dto.UserId);
            var chat = await context.Chat.FindAsync(dto.ChatId);
            if (!user!.IsAdmin)
                return new ServiceResult { Success = false, ErrorMessage = "not admin" };

            context.Chat.Remove(chat!);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = chat };
        }
    }
}
