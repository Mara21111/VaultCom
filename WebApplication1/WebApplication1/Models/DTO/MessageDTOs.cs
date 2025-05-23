namespace WebApplication1.Models.DTO
{
    public class MessageDTO : UserChatRelationshipDTO
    {
        public string Content { get; set; }
        public int? ReplyMessageId { get; set; }
    }
    public class MessageFindDTO
    {
        public int UserId { get; set; }
        public int ChatId { get; set; }
        public int MessageId { get; set; }
    }
}