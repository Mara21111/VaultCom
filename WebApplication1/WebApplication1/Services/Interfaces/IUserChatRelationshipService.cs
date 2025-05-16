using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserChatRelationshipService
    {
        Task<ServiceResult> CreateUserChatRelationAsync(UserChatRelationDTO dto);
        Task<ServiceResult> JoinPublicChatAsync(UserChatRelationDTO dto);
    }
}
