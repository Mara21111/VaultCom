using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models.DTO
{
    public class UserRelationshipDTOs
    {
        public int SenderId { get; set; }

        public int RecieverId { get; set; }

        public UserRelationshipDTOs Reverse()
            => new() { SenderId = RecieverId, RecieverId = SenderId };
    }
}
