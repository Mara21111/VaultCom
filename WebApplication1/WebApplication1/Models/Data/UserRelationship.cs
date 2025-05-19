namespace WebApplication1.Models.Data
{
    public class UserRelationship
    {
        public int Id { get; set; }

        public int SenderId { get; set; }

        public int RecieverId { get; set; }

        public bool IsBlocked { get; set; }

        public bool IsMuted { get; set; }

        public bool IsFriend { get; set; }

        public bool Pending { get; set; }

        public string Nickname { get; set; }
    }
}
