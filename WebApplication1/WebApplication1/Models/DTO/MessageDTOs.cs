namespace WebApplication1.Models.DTO
{
    public class MessageDTO : UserChatRelationshipDTO
    {
        public string Content { get; set; }
        public int? ReplyMessageId { get; set; }
    }
    public class MessageEditDTO
    {
        public int UserId { get; set; }
        public int MessageId { get; set; }
        public string? NewContent { get; set; }
        public bool? Pin { get; set; }
    }
}