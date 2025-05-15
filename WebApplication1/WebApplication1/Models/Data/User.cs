using Org.BouncyCastle.Asn1.Mozilla;

namespace WebApplication1.Models.Data
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Username { get; set; }

        public string? Bio {  get; set; }

        public int Status { get; set; }

        public bool IsPublic { get; set; }

        public bool IsAdmin { get; set; }

        public DateTime CreatedAt { get; set; }

        public string PrivateKey { get; set; }

        public string PublicKey { get; set; }

        public DateTime? TimeoutEnd { get; set; }

        public DateTime? BanEnd { get; set; }

        public bool SafeMode { get; set; }
    }
}
