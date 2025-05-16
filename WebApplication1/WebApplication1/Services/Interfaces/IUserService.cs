using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserService
    {
        Task<ServiceResult> CreateUserAsync(CreateUserDTO dto);
        Task<ServiceResult> GetAllUsersAdminViewAsync();
        Task<ServiceResult> EditUserAsync(EditUserDTO dto);
        Task<ServiceResult> ToggleUserSettingAsync(UserToggleDTO dto);
        Task<ServiceResult> DeleteUserAsync(int requestorId, int targetId);
        Task<ServiceResult> GetUserAsync(int id);
        Task<ServiceResult> GetUsers(UserFilterDTO? filter);
        Task<ServiceResult> GetSelfUserAsync(int id);
    }
}
