using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IChatService
    {
        Task<ServiceResult> CreateChat(CreateChatDTO dto);
        Task<ServiceResult> DeleteChatAsync(UserChatRelationshipDTO dto);
        Task<ServiceResult> GetChatsAsync(ChatFilterDTO? dto);
        Task<ServiceResult> GetPublicChatsAsync();
    }
}
