using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserChatRelationshipService
    {
        object MapUserToDTO(int id);
        Task<ServiceResult> CreateUserChatRelationAsync(UserChatRelationshipDTO dto);
        Task<ServiceResult> JoinPublicChatAsync(UserChatRelationshipDTO dto);
        Task<ServiceResult> GetUsersInChatAsync(int id);
        Task<ServiceResult> LeavePublicChatAsync(UserChatRelationshipDTO dto);
        Task<ServiceResult> MuteChatToggleAsync(UserChatRelationshipDTO dto);
    }
}
