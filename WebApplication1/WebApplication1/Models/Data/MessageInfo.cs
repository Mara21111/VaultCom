using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models.Data
{
    public class MessageInfo
    {
        [Key]
        public int Id { get; set; }

        public int MessageId { get; set; }

        public int ChatId { get; set; }

        public int UserId { get; set; }

        public bool Seen { get; set; }
    }
}
