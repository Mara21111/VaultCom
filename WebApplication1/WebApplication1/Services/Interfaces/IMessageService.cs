using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IMessageService
    {
        Task<ServiceResult> SendMessageAsync(MessageDTO dto);
        Task<ServiceResult> GetMessagesInChatAsync(int userId, int chatId);
    }
}