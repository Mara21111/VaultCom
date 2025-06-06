using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IMessageService
    {
        Task<ServiceResult> SendMessageAsync(MessageDTO dto);
        Task<ServiceResult> EditMessageAsync(MessageEditDTO dto);
        Task<ServiceResult> GetMessagesInChatAsync(int userId, int chatId, bool seen);
        Task<ServiceResult> DeleteMessageAsync(int userId, int messageId);
        Task<ServiceResult> UserTypingAsync(UserChatRelationshipDTO dto);
        Task<ServiceResult> UserStoppedTypingAsync(UserChatRelationshipDTO dto);
    }
}