using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IPrivateChatService
    {
        Task<bool> ChatExists(UserRelationshipDTO dto);
        Task<ServiceResult> CreatePrivateChatAsync(UserRelationshipDTO dto);
        Task<ServiceResult> GetPrivateChatUserIds(int id);
        Task<ServiceResult> GetPrivateChatUsers(int id);
    }
}
