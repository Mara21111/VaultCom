namespace WebApplication1.Models.Data
{
    public class Message
    {
        public int Id { get; set; } 

        public int ChatId { get; set; }

        public int UserId { get; set; }

        public int? PreviousMessageId { get; set; }

        public string Content { get; set; }

        public string? SelfContent { get; set; }

        public string? URLLink { get; set; }

        public DateTime Time {  get; set; }

        public bool IsEdited { get; set; }

        public bool IsPinned { get; set; }
    }
}
