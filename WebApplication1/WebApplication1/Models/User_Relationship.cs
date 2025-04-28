namespace WebApplication1.Models
{
    public class User_Relationship
    {
        public int Id { get; set; }

        public int User_Id { get; set; }

        public int Friend_User_Id { get; set; }

        public bool Is_Blocked { get; set; }

        public bool Is_Muted { get; set; }

        public bool Is_Friend { get; set; }

        public bool Pending { get; set; }

        public string Nickname { get; set; }
    }
}
