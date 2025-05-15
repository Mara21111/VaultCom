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
        public DateTime Created_At { get; set; }
        public DateTime? Timeout_End { get; set; }
        public DateTime? Ban_End { get; set; }
    }
    public class PublicUserDataDTO : BaseUserDataDTO
    {
        public string Email { get; set; }
        public bool Safe_Mode { get; set; }
    }
    public class UserFilterDTO
    {
        public bool? Banned { get; set; }
        public bool? TimeOut { get; set; }
        public int? Status { get; set; }
    }
}