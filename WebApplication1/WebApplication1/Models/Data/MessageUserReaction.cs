namespace WebApplication1.Models.Data
{
    public class MessageUserReaction
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int MessageId { get; set; }

        public int ReactionId { get; set; }
    }
}