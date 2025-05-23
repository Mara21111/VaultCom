using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IPublicChatService
    {
        Task<ServiceResult> CreatePublicChatAsync(CreatePublicChatDTO dto);
        Task<ServiceResult> DeletePublicChatAsync(int userId, int chatId);
    }
}
