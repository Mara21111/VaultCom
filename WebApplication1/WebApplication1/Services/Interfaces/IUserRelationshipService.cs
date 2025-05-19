
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserRelationshipService
    {
        //Task<ServiceResult> SendFriendRequestAsync(RequestDTO dto);
        Task<ServiceResult> GetIncomingFriendRequestsAsync(int id);
        Task<ServiceResult> GetOutcomingFriendRequestsAsync(int id);
        Task<ServiceResult> GetFriendsAsync(int id);
    }
}
