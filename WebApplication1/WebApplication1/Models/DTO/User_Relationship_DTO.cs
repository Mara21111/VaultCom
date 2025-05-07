using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models.DTO
{
    public class User_Relationship_DTO
    {
        public int sender_id { get; set; }

        public int reciever_id { get; set; }

        public User_Relationship_DTO Reverse()
            => new() { sender_id = reciever_id, reciever_id = sender_id };
    }
}
