using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models.Data
{
    public class UserChatRelationship
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ChatId { get; set; }

        public bool MutedChat { get; set; }
    }
}
