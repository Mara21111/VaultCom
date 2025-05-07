using Microsoft.AspNetCore.Identity;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly MyContext context;

        public UserService(MyContext context)
        {
            this.context = context;
        }

        public async Task<User> CreateUserAsync(User_DTO dto)
        {
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Bio = dto.Bio ?? "no bio...",
                Password = dto.Password,
                Is_Admin = false,
                Created_At = DateTime.Now,
                Ban_End = null,
                Timeout_End = null,
                Is_Public = true,
                Phone_Number = "",
                Private_Key = "",
                Public_Key = "",
                Safe_Mode = false,
                Status = 1
            };

            context.User.Add(user);
            await context.SaveChangesAsync();
            return user;
        }
    }
}
