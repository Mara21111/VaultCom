using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models
{
    public class User_Chat
    {
        public int Id { get; set; }
        public int User_Id { get; set; }

        public int Chat_Id { get; set; }

        public bool Muted_Chat { get; set; }
    }
}
