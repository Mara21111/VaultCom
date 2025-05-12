using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserService
    {
        Task<ServiceResult> CreateUserAsync(CreateUserDTO dto);
        Task<ServiceResult> GetAllUsersAdminViewAsync();
        Task<ServiceResult> EditUserAsync(EditUserDTO dto);
        Task<ServiceResult> DeleteUserAsync(RequestDTO dto);
        Task<ServiceResult> GetUserAsync(int id);
        Task<ServiceResult> GetUsers(UserFilterDTO? filter);
    }
}
