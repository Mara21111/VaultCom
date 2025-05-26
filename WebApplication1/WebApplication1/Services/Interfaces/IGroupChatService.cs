using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IGroupChatService
    {
        Task<ServiceResult> CreateGroupChatAsync(CreateGroupChatDTO dto);
        Task<ServiceResult> EditGroupChatAsync(GroupChatEditDTO dto);
        Task<ServiceResult> DeleteGroupChatAsync(UserChatRelationshipDTO dto);
    }
}
