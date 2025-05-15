using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
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

        private object MapUserToDTO(User user)
        {
            if (user.IsPublic)
            {
                return new PublicUserDataDTO
                {
                    Username = user.Username,
                    Bio = user.Bio,
                    Created_At = user.CreatedAt,
                    Timeout_End = user.TimeoutEnd,
                    Ban_End = user.BanEnd,
                    Email = user.Email,
                    Safe_Mode = user.SafeMode,
                };
            }
            else
            {
                return new BaseUserDataDTO
                {
                    Username = user.Username,
                    Bio = user.Bio,
                    Created_At = user.CreatedAt,
                    Timeout_End = user.TimeoutEnd,
                    Ban_End = user.BanEnd
                };
            }
        }

        public async Task<ServiceResult> CreateUserAsync(CreateUserDTO dto)
        {
            if (await context.User.AnyAsync(x => x.Username == dto.Username))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Username is already taken", ErrorCode = 409 };
            }
            if (await context.User.AnyAsync(x => x.Email == dto.Email))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Email already exists", ErrorCode = 409 };
            }
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Bio = dto.Bio ?? "no bio...",
                Password = dto.Password,
                IsAdmin = false,
                CreatedAt = DateTime.Now,
                BanEnd = null,
                TimeoutEnd = null,
                IsPublic = true,
                PrivateKey = "",
                PublicKey = "",
                SafeMode = false,
                Status = 1
            };

            if (dto.IsAdmin.HasValue)
                user.IsAdmin = dto.IsAdmin.Value;

            context.User.Add(user);

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = user };
        }

        public async Task<ServiceResult> EditUserAsync(EditUserDTO dto)
        {
            User? requestor = context.User.Find(dto.RequestorId);
            User? target = context.User.Find(dto.TargetId);
            if (requestor == null || target == null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User does not exist", ErrorCode = 404 };
            }
            if (dto.RequestorId != dto.TargetId)
            {
                return new ServiceResult { Success = false, ErrorMessage = "Cannot change other user info", ErrorCode = 403 };
            }
            if (await context.User.AnyAsync(x => x.Username == dto.Username && x.Id != dto.TargetId))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Username is already taken", ErrorCode = 409 };
            }
            if (await context.User.AnyAsync(x => x.Email == dto.Email && x.Id != dto.TargetId))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Email already exists", ErrorCode = 409 };
            }

            target.Username = dto.Username;
            target.Email = dto.Email;
            target.Password = dto.Password;
            target.Bio = dto.Bio;

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = target };
        }

        public async Task<ServiceResult> DeleteUserAsync(RequestDTO dto)
        {
            User? requestor = context.User.Find(dto.RequestorId);
            User? target = context.User.Find(dto.TargetId);
            if (requestor == null || target == null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User does not exist", ErrorCode = 404 };
            }
            if (!requestor.IsAdmin && dto.RequestorId != dto.TargetId)
            {
                return new ServiceResult { Success = false, ErrorMessage = "Does not have perission to delete account", ErrorCode = 403 };
            }

            context.User.Remove(target);

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = target };
        }

        public async Task<ServiceResult> GetUsers(UserFilterDTO? filter = null)
        {
            IQueryable<User> query = context.User;

            if (filter is not null)
            {
                if (filter.Banned.HasValue)
                    query = query.Where(x => x.BanEnd.HasValue == filter.Banned);
                if (filter.TimeOut.HasValue)
                    query = query.Where(x => x.TimeoutEnd.HasValue == filter.TimeOut);
                if (filter.Status.HasValue)
                    query = query.Where(x => x.Status == filter.Status);
            }

            var users = await query.ToListAsync();
            var userDTOs = users.Select(MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data = userDTOs };
        }

        public async Task<ServiceResult> GetAllUsersAdminViewAsync()
        {
            var users = await context.User.ToListAsync();

            return new ServiceResult { Success = true, Data = users };
        }

        public async Task<ServiceResult> GetUserAsync(int id)
        {
            User? user = await context.User.FindAsync(id);
            if (user == null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User does not exist", ErrorCode = 404 };
            }

            var dto = MapUserToDTO(user);
            
            return new ServiceResult { Success = true, Data = dto };
        }
    }
}
