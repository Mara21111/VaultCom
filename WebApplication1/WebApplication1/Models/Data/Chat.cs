namespace WebApplication1.Models.Data
{
    public class Chat
    {
        public int Id { get; set; }

        public bool Is_Public { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int Creator_Id { get; set; }
    }
}