namespace WebApplication1.Models.Data
{
    public class PrivateChat
    {
        public int Id { get; set; }
        public int UserAId { get; set; }
        public int UserBId { get; set; }

        public int GetOtherUser(int userId)
            => userId == UserAId ? UserBId : UserAId;
    }
}