namespace WebApplication1.Models.DTO
{
    public class MessageDTO
    {
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public string Message { get; set; }
        public int? ReplyMessageId { get; set; }
    }
}