using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models.DTO
{
    public class RequestDTO
    {
        public int RequestorId { get; set; }
        public int TargetId { get; set; }
        public async Task<bool> Exists(MyContext context)
        {
            return await context.User.Where(x => x.Id == RequestorId).AnyAsync()
                && await context.User.Where(x => x.Id == TargetId).AnyAsync();
        }
    }
    public class CreateUserDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Bio { get; set; }
        public bool? IsAdmin { get; set; }
    }
    public class EditUserDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Bio { get; set; }
    }
    public class UserGetterDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Bio { get; set; }
        public string? ProfilePicture {  get; set; }
        public string? CreateDate { get; set; }
        public string? TimeoutEnd { get; set; }
        public string? BanEnd { get; set; }
        public string? Email { get; set; }
        public bool? SafeMode { get; set; }
        public int? ReportCount { get; set; }
    }
    public class UserFilterDTO
    {
        public bool? Banned { get; set; }
        public bool? TimeOut { get; set; }
        public bool? Status { get; set; }
    }
    public class UserToggleDTO
    {
        public int Id { get; set; }
        public bool Value { get; set; }
    }
    public class ProfilePictureDTO
    {
        public int Id { get; set; }
        public IFormFile PFP { get; set; }
    }
    public class ChangePasswordDTO
    {
        public int Id { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
        public string NewPassword2 { get; set; }
    }
}