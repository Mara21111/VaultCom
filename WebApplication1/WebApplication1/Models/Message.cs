namespace WebApplication1.Models
{
    public class Message
    {
        public int Id { get; set; } 

        public int Chat_Id { get; set; }

        public int User_Id { get; set; }

        public int? Previous_Message_Id { get; set; }

        public string Content { get; set; }

        public string? URL_Link { get; set; }

        public DateTime Time {  get; set; }

        public bool Is_Edited { get; set; }

        public bool Is_Single_Use { get; set; }

        public bool Is_Pinned { get; set; }
    }
}
