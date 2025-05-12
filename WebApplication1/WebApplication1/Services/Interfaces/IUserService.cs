using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Implementations;

namespace WebApplication1.Services.Interfaces
{
    public interface IUserService
    {
        Task<ServiceResult> CreateUserAsync(User_DTO createUserDto);
    }
}
