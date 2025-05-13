using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IChatService
    {
        Task<ServiceResult> CreatePublicChatAsync(CreatePublicChatDTO dto);
        Task<ServiceResult> CreateGroupChatAsync(CreateGroupChatDTO dto);
        Task<ServiceResult> GetChats(ChatFilterDTO? dto);
    }
}
