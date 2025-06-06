using System.Linq;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Crmf;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;
using ZstdSharp.Unsafe;

namespace WebApplication1.Services.Implementations
{
    public class GroupChatService : IGroupChatService
    {
        private readonly MyContext context;
        private readonly IChatService _chatService;
        private readonly IUserChatRelationshipService _userChatRelationshipService;
        private readonly IMessageService _messageService;

        public GroupChatService(MyContext context, IChatService chatService, IUserChatRelationshipService userChatRelationshipService, IMessageService messageService)
        {
            this.context = context;
            _chatService = chatService;
            _userChatRelationshipService = userChatRelationshipService;
            _messageService = messageService;
        }

        public async Task<ServiceResult> CreateGroupChatAsync(CreateGroupChatDTO dto)
        {
            var gc = new GroupChat
            {
                Title = dto.Title,
                OwnerId = dto.CreatorId
            };

            context.GroupChat.Add(gc);
            await context.SaveChangesAsync();

            await _chatService.CreateChat(new CreateChatDTO
            {
                Type = 2,
                Id = gc.Id
            });

            var baseChat = await context.Chat.OrderByDescending(x => x.Id).FirstOrDefaultAsync();

            await _userChatRelationshipService.CreateUserChatRelationAsync(new UserChatRelationshipDTO
            {
                UserId = dto.CreatorId,
                ChatId = baseChat!.Id
            });

            foreach (var chatId in dto.ChatIds)
            {
                var chat = await context.Chat.FindAsync(chatId);
                var pc = await context.PrivateChat.FindAsync(chat!.ChatId);
                await _userChatRelationshipService.CreateUserChatRelationAsync(new UserChatRelationshipDTO
                {
                    UserId = pc!.GetOtherUserId(dto.CreatorId),
                    ChatId = baseChat.Id
                });
            }

            return new ServiceResult { Success = true, Data = dto };
        }

        public async Task<ServiceResult> EditGroupChatAsync(GroupChatEditDTO dto)
        {
            var chat = await context.Chat.FindAsync(dto.ChatId);
            var gc = await context.GroupChat.FindAsync(chat!.ChatId);
            var user = await context.User.FindAsync(dto.UserId);
            if (user!.Id != gc!.OwnerId)
                return new ServiceResult { Success = false, ErrorMessage = "user is not owner of gc" };
            if (dto.Title.Length == 0)
                return new ServiceResult { Success = false, ErrorMessage = "cannot make empty name" };

            gc.Title = dto.Title;
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = gc };
        }

        public async Task<ServiceResult> DeleteGroupChatAsync(UserChatRelationshipDTO dto)
        {
            var chat = await context.Chat.FindAsync(dto.ChatId);
            var gc = await context.GroupChat.FindAsync(chat!.ChatId);
            if (gc!.OwnerId != dto.UserId)
                return new ServiceResult { Success = false, ErrorMessage = "cannot delete group chat" };
            var messages = (List<Message>)(await _messageService.GetMessagesInChatAsync(dto.UserId, chat.Id, false)).Data!;
            var users = (List<UserGetterDTO>)(await _userChatRelationshipService.GetUsersInChatAsync(chat.Id)).Data!;

            foreach (var msg in messages)
            {
                await _messageService.DeleteMessageAsync(dto.UserId, msg.Id);
            }
            foreach (var item in users)
            {
                await _userChatRelationshipService.LeaveChatAsync(new UserChatRelationshipDTO
                {
                    UserId = item.Id,
                    ChatId = chat.Id
                });
            }
            await _chatService.DeleteChatAsync(dto);

            context.GroupChat.Remove(gc);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = gc };
        }
    }
}
