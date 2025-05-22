using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebApplication1.Models.DTO
{
    public class UserChatRelationshipDTO
    {
        public int ChatId { get; set; }
        public int UserId { get; set; }
        public async Task<bool> InChat(MyContext context)
            => await context.UserChatRelationship.Where(x => x.ChatId == ChatId && x.UserId == UserId).AnyAsync();
    }
}