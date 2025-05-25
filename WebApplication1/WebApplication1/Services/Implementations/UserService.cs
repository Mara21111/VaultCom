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
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MySql.Data.MySqlClient;
using System.IO;
using static Org.BouncyCastle.Math.EC.ECCurve;
using Microsoft.Extensions.Caching.Memory;
using System.Diagnostics;

namespace WebApplication1.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly MyContext context;
        private readonly IReportService _reportService;
        private readonly IWebHostEnvironment _env;
        private readonly string _connString;
        private static readonly MemoryCache _cache = new MemoryCache(new MemoryCacheOptions());
        private static readonly TimeSpan _timeout = TimeSpan.FromMinutes(3);

        public UserService(MyContext context, IReportService reportService, IWebHostEnvironment env, IConfiguration config)
        {
            this.context = context;
            _reportService = reportService;
            _env = env; 
            _connString = config.GetConnectionString("DefaultConnection")!;
        }

        public async Task<ActivityResult> SetActivityAsync(int id)
        {
            var user = await context.User.FindAsync(id);
            if (user is null)
                return new ActivityResult { IsActive = false };

            _cache.Set(id, DateTime.UtcNow, _timeout); 
            return new ActivityResult { IsActive = true };
        }

        public async Task<ActivityResult> IsUserOnlineAsync(int id)
        {
            var user = await context.User.FindAsync(id);
            if (user is null)
                return new ActivityResult { IsActive = false };

            return new ActivityResult { IsActive = _cache.TryGetValue(id, out _) };
        }

        public UserGetterDTO MapUserToDTO(User user)
        {
            UserGetterDTO dto = new UserGetterDTO
            {
                Id = user.Id,
                Username = user.Username,
                ProfilePicture = user.ProfilePicture,
                CreateDate = user.CreatedAt.ToShortDateString(),
                BanEnd = user.BanEnd?.ToShortDateString(),
                TimeoutEnd = user.TimeoutEnd?.ToShortDateString(),
            };
            if (user.IsPublic)
            {
                dto.Email = user.Email;
                dto.Bio = user.Bio!;
                dto.SafeMode = user.SafeMode;
            }
            return dto;
        }

        public UserGetterDTO AdminMap(User user)
        {
            UserGetterDTO dto = MapUserToDTO(user);
            dto.ReportCount = (int)_reportService.GetReportCountAsync(user.Id, context).Result.Data!;
            return dto;
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
                SafeMode = false
            };

            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, dto.Password);

            var rsa = RSA.Create(2048);
            user.PublicKey = Convert.ToBase64String(rsa.ExportSubjectPublicKeyInfo());
            user.PrivateKey = Convert.ToBase64String(rsa.ExportPkcs8PrivateKey());

            if (dto.IsAdmin.HasValue)
                user.IsAdmin = dto.IsAdmin.Value;

            context.User.Add(user);

            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = user };
        }

        public async Task<ServiceResult> UploadPFPAsync(ProfilePictureDTO dto)
        {
            var user = await context.User.FindAsync(dto.Id);

            var fileName = $"user-{dto.Id}-{Guid.NewGuid()}{Path.GetExtension(dto.PFP.FileName)}";
            var path = Path.Combine(_env.WebRootPath, "uploads", "pfps", fileName);

            if (!string.IsNullOrWhiteSpace(user!.ProfilePicture))
            {
                var oldPath = Path.Combine(_env.WebRootPath, user.ProfilePicture.TrimStart('/'));
                if (System.IO.File.Exists(oldPath))
                {
                    System.IO.File.Delete(oldPath);
                }
            }

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await dto.PFP.CopyToAsync(stream);
            }

            user.ProfilePicture = $"/uploads/pfps/{fileName}";
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = user.ProfilePicture };
        }

        public async Task<ServiceResult> GetPFPAsync(int id)
        {
            using var conn = new MySqlConnection(_connString);
            await conn.OpenAsync();

            var cmd = new MySqlCommand("SELECT ProfilePicture FROM User WHERE Id = @id", conn);
            cmd.Parameters.AddWithValue("@id", id);

            var result = await cmd.ExecuteScalarAsync();
            return result != null
                ? new ServiceResult { Success = true, Data = result.ToString() }
                : new ServiceResult { Success = false, ErrorMessage = "ultra bad shit happened" };
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

        public async Task<ServiceResult> ToggleUserSettingAsync(UserToggleDTO dto, string prop)
        {
            var user = await context.User.FindAsync(dto.Id);

            var property = typeof(User).GetProperty(prop);
            property!.SetValue(user, dto.Value);

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
                    query = query.Where(x => IsUserOnlineAsync(x.Id).Result.IsActive == filter.Status.Value);
            }

            var users = await query.ToListAsync();
            var userDTOs = users.Select(MapUserToDTO).ToList();

            return new ServiceResult { Success = true, Data = userDTOs };
        }

        public async Task<ServiceResult> GetAllUsersAdminViewAsync()
        {
            var users = await context.User.ToListAsync();
            var userDTOs = users.Select(AdminMap).ToList();

            return new ServiceResult { Success = true, Data = userDTOs };
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
            User? user = await context.User.FindAsync(id);

            return new ServiceResult { Success = true, Data = user };
        }
    }
}
