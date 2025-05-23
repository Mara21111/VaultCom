using System.Linq;
using Google.Protobuf;
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
    public class PublicChatService : IPublicChatService
    {
        private readonly MyContext context;
        private readonly IChatService _chatService;
        private readonly IUserChatRelationshipService _userChatRelationshipService;
        public readonly IMessageService _messageService;

        public PublicChatService(MyContext context, IChatService chatService, IUserChatRelationshipService userChatRelationshipService, IMessageService messageService)
        {
            this.context = context;
            _chatService = chatService;
            _userChatRelationshipService = userChatRelationshipService;
            _messageService = messageService;
        }

        public async Task<ServiceResult> CreatePublicChatAsync(CreatePublicChatDTO dto)
        {
            var creator = await context.User.FindAsync(dto.CreatorId);
            if (creator == null || !creator.IsAdmin)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User is not admin", ErrorCode = 403 };
            }

            if (await context.PublicChat.AnyAsync(x => x.Title == dto.Title))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Public chat already exists", ErrorCode = 409 };
            }

            var publicChat = new PublicChat
            {
                Title = dto.Title,
                Description = dto.Desc
            };

            context.PublicChat.Add(publicChat);
            await context.SaveChangesAsync();

            await _chatService.CreateChat(new CreateChatDTO
            {
                Type = 1,
                Id = publicChat.Id
            });
            var baseChat = await context.Chat.OrderByDescending(x => x.Id).FirstOrDefaultAsync();

            List<int> admins = await context.User.Where(x => x.IsAdmin).Select(x => x.Id).ToListAsync();
            foreach (var admin in admins)
            {
                await _userChatRelationshipService.CreateUserChatRelationAsync(new UserChatRelationshipDTO
                {
                    UserId = admin,
                    ChatId = baseChat.Id
                });
            }

            return new ServiceResult { Success = true, Data = dto };
        }

        public async Task<ServiceResult> DeletePublicChatAsync(int userId, int chatId)
        {
            var chat = await context.Chat.FindAsync(chatId);
            var pc = await context.PublicChat.FindAsync(chat.ChatId);
            var messages = (List<Message>)(await _messageService.GetMessagesInChatAsync(userId, chatId)).Data;
            var users = (List<UserGetterDTO>)(await _userChatRelationshipService.GetUsersInChatAsync(chat.Id)).Data;

            foreach (var msg in messages)
            {
                await _messageService.DeleteMessageAsync(userId, msg.Id);
            }
            foreach (var user in users)
            {
                await _userChatRelationshipService.LeavePublicChatAsync(new UserChatRelationshipDTO
                {
                    UserId = user.Id,
                    ChatId = chat.Id
                });
            }
            await _chatService.DeleteChatAsync(new UserChatRelationshipDTO { UserId = userId, ChatId = chatId });

            context.PublicChat.Remove(pc);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = pc };
        }

        public async Task<ServiceResult> EditPublicChatAsync(PublicChatEditDTO dto)
        {
            var user = await context.User.FindAsync(dto.UserId);
            if (user is null || !user.IsAdmin)
                return new ServiceResult { Success = false, ErrorMessage = "user is not admin" };
            var chat = await context.Chat.FindAsync(dto.ChatId);
            if (chat is null)
                return new ServiceResult { Success = false, ErrorMessage = "chat does not exist" };
            var publicChat = await context.PublicChat.FindAsync(chat.ChatId);
            if (publicChat is null)
                return new ServiceResult { Success = false, ErrorMessage = "chat exists in 'Chat' table but not in 'PublicChat' table" };

            if (dto.Title is not null && dto.Title.Length != 0)
                publicChat.Title = dto.Title;
            if (dto.Description is not null && dto.Description.Length != 0)
                publicChat.Description = dto.Description;

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = publicChat };
        }
    }
}
