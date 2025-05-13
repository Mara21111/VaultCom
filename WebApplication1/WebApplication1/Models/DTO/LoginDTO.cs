namespace WebApplication1.Models.DTO
{
    public class LoginDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    public class AuthResult
    {
        public bool Success { get; set; }
        public string Token { get; set; }
        public string Message { get; set; }
    }
}
