namespace WebApplication1.Models.DTO
{
    public class CreateChatDTO
    {
        public int CreatorId { get; set; }
        public string Title { get; set; }
    }
    public class CreatePublicChatDTO : CreateChatDTO
    {
        public string Desc { get; set; }
    }
    public class CreateGroupChatDTO : CreateChatDTO
    {
        public List<int> UserIds { get; set; }
    }
    public class ChatFilterDTO
    {
        public int? RequestorId {  get; set; }
        public bool? IsPublic { get; set; }
        public bool? IsIn { get; set; }
    }
}