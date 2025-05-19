using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserChatRelationshipService
    {
        object MapUserToDTO(int id);
        Task<ServiceResult> CreateUserChatRelationAsync(UserChatRelationDTO dto);
        Task<ServiceResult> JoinPublicChatAsync(UserChatRelationDTO dto);
        Task<ServiceResult> GetUsersInChatAsync(int id);
    }
}
