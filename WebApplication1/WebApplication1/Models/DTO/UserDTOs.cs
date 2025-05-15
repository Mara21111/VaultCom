namespace WebApplication1.Models.DTO
{
    public class RequestDTO
    {
        public int RequestorId { get; set; }
        public int TargetId { get; set; }
    }
    public class CreateUserDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Bio { get; set; }
        public bool? IsAdmin { get; set; }
    }
    public class EditUserDTO : RequestDTO
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Bio { get; set; }
    }
    public class BaseUserDataDTO
    {
        public string Username { get; set; }
        public string Bio { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? TimeoutEnd { get; set; }
        public DateTime? BanEnd { get; set; }
    }
    public class PublicUserDataDTO : BaseUserDataDTO
    {
        public string Email { get; set; }
        public bool SafeMode { get; set; }
    }
    public class UserFilterDTO
    {
        public bool? Banned { get; set; }
        public bool? TimeOut { get; set; }
        public int? Status { get; set; }
    }
    public class UserToggleDTO : RequestDTO
    {
        public string ValueName { get; set; }
        public bool Value { get; set; }
    }
}