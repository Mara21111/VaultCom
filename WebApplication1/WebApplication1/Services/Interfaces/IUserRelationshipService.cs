
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserRelationshipService
    {
        Task<ServiceResult> SendFriendRequestAsync(UserRelationshipDTO dto);
        Task<ServiceResult> AcceptFriendRequestAsync(UserRelationshipDTO dto);
        Task<ServiceResult> RemoveRequestAsync(UserRelationshipDTO dto);
        Task<ServiceResult> UnfriendAsync(UserRelationshipDTO dto);
        Task<ServiceResult> GetIncomingFriendRequestsAsync(int id);
        Task<ServiceResult> GetOutcomingFriendRequestsAsync(int id);
        Task<ServiceResult> GetFriendsAsync(int id);
    }
}
