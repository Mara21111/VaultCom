namespace WebApplication1.Models.DTO
{
    public class CreateChatDTO
    {
        public int Type { get; set; }
        public int Id { get; set; }
    }
    public class CreatePublicChatDTO
    {
        public int CreatorId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }
    public class CreateGroupChatDTO
    {
        public int CreatorId { get; set; }
        public string Title { get; set; }
        public List<int> ChatIds { get; set; }
    }
    public class ChatFilterDTO
    {
        public int RequestorId { get; set; }
        public int? Type { get; set; }
        public bool? IsIn { get; set; }
        public bool? IsMuted { get; set; }
        public string? Prompt { get; set; }
    }
    public class ChatGetterDTO
    {
        public int Id {  set; get; }
        public string Title { set; get; }
        public int? OwnerId {  get; set; }
        public string ChatType { get; set; }
        public int UnreadMessages { get; set; }
    }
    public class ChatSearchDTO
    {
        public int Id { get; set; }
        public string Prompt { get; set; }
    }
    public class PublicChatGetterDTO : ChatGetterDTO
    {
        public int Users {  get; set; }
        public int ActiveUsers { get; set; }
        public string Description {  get; set; }
    }
    public class PublicChatEditDTO : UserChatRelationshipDTO
    {
        public string? Title {  get; set; }
        public string? Description { get; set; }
    }
    public class GroupChatEditDTO : UserChatRelationshipDTO
    {
        public string Title { get; set; }
    }
}