using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;
using System.Security.Cryptography;

namespace WebApplication1.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly MyContext context;

        public UserService(MyContext context)
        {
            this.context = context;
        }

        public object MapUserToDTO(User user)
        {
            if (user.IsPublic)
            {
                return new PublicUserDataDTO
                {
                    Username = user.Username,
                    Bio = user.Bio,
                    CreatedAt = user.CreatedAt,
                    TimeoutEnd = user.TimeoutEnd,
                    BanEnd = user.BanEnd,
                    Email = user.Email,
                    SafeMode = user.SafeMode,
                };
            }
            else
            {
                return new BaseUserDataDTO
                {
                    Username = user.Username,
                    Bio = user.Bio,
                    CreatedAt = user.CreatedAt,
                    TimeoutEnd = user.TimeoutEnd,
                    BanEnd = user.BanEnd
                };
            }
        }

        public async Task<ServiceResult> CreateUserAsync(CreateUserDTO dto)
        {
            dto.Username = dto.Username.ToLower();
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
                IsAdmin = false,
                CreatedAt = DateTime.Now,
                BanEnd = null,
                TimeoutEnd = null,
                IsPublic = true,
                SafeMode = false,
                Status = 1
            };

            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, dto.Password);

            var rsa = RSA.Create(2048); // 2048 bit klic
            user.PublicKey = Convert.ToBase64String(rsa.ExportSubjectPublicKeyInfo());
            user.PrivateKey = Convert.ToBase64String(rsa.ExportPkcs8PrivateKey());

            if (dto.IsAdmin.HasValue)
                user.IsAdmin = dto.IsAdmin.Value;

            context.User.Add(user);

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = user };
        }

        public async Task<ServiceResult> EditUserAsync(EditUserDTO dto)
        {
            User? user = await context.User.FindAsync(dto.Id);
            if (user == null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User does not exist", ErrorCode = 404 };
            }
            if (await context.User.AnyAsync(x => x.Username == dto.Username && x.Id != dto.Id))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Username is already taken", ErrorCode = 409 };
            }
            if (await context.User.AnyAsync(x => x.Email == dto.Email && x.Id != dto.Id))
            {
                return new ServiceResult { Success = false, ErrorMessage = "Email already exists", ErrorCode = 409 };
            }

            user.Username = dto.Username;
            user.Email = dto.Email;
            user.Password = dto.Password;
            user.Bio = dto.Bio;

            if (user.Password != dto.Password) // check later doufam ze to funguje
            {
                var hasher = new PasswordHasher<User>();
                user.Password = hasher.HashPassword(user, dto.Password);
            }

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = user };
        }

        public async Task<ServiceResult> ToggleUserSettingAsync(UserToggleDTO dto)
        {
            var user = await context.User.FindAsync(dto.Id);

            if (dto.ValueName == "IsAdmin" && !user.IsAdmin)
            {
                return new ServiceResult { Success = false, ErrorMessage = "Denied admin access", ErrorCode = 403 };
            }

            var property = typeof(User).GetProperty(dto.ValueName);

            property.SetValue(user, dto.Value);

            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = user };
        }


        public async Task<ServiceResult> DeleteUserAsync(int requestorId, int targetId)
        {
            User? requestor = context.User.Find(requestorId);
            User? target = context.User.Find(targetId);
            if (requestor == null || target == null)
            {
                return new ServiceResult { Success = false, ErrorMessage = "User does not exist", ErrorCode = 404 };
            }
            if (!requestor.IsAdmin && requestorId != targetId)
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

        public async Task<ServiceResult> GetSelfUserAsync(int id)
        {
            User user = await context.User.FindAsync(id);

            return new ServiceResult { Success = true, Data = user };
        }
    }
}
