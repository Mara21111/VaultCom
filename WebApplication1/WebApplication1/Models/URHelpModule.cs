using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class URHelpModule
    {
        public int sender_id { get; set; }

        public int reciever_id { get; set; }

        public URHelpModule Reverse()
            => new() { sender_id = reciever_id, reciever_id = sender_id };
    }
}
