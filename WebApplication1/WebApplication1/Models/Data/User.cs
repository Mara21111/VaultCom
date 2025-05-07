using Org.BouncyCastle.Asn1.Mozilla;

namespace WebApplication1.Models.Data
{
    public class User
    {
        public int Id { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        public string Username { get; set; }
        
        public string? Phone_Number { get; set; }

        public string? Bio {  get; set; }

        public int Status { get; set; }

        public bool Is_Public { get; set; }

        public bool Is_Admin { get; set; }

        public DateTime Created_At { get; set; }

        public string Private_Key { get; set; }

        public string Public_Key { get; set; }

        public DateTime? Timeout_End { get; set; }

        public DateTime? Ban_End { get; set; }

        public bool Safe_Mode { get; set; }
    }
}
