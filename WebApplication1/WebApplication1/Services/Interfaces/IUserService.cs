using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserService
    {
        Task<ActivityResult> SetActivityAsync(int id);
        Task<ActivityResult> IsUserOnlineAsync(int id);
        object MapUserToDTO(User user);
        Task<ServiceResult> CreateUserAsync(CreateUserDTO dto);
        Task<ServiceResult> UploadPFPAsync(ProfilePictureDTO dto);
        Task<ServiceResult> GetPFPAsync(int id);
        Task<ServiceResult> GetAllUsersAdminViewAsync();
        Task<ServiceResult> EditUserAsync(EditUserDTO dto);
        Task<ServiceResult> ToggleUserSettingAsync(UserToggleDTO dto, string prop);
        Task<ServiceResult> DeleteUserAsync(int requestorId, int targetId);
        Task<ServiceResult> GetUserAsync(int id);
        Task<ServiceResult> GetUsers(UserFilterDTO? filter);
        Task<ServiceResult> GetSelfUserAsync(int id);
    }
}
