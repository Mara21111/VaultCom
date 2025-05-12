namespace WebApplication1.Models.DTO
{
    public class CreateChatDTO
    {
        public int CreatorId {  get; set; }
        public string Title { get; set; }
        public string Desc {  get; set; }
        public List<int> UserIds { get; set; }
    }
}