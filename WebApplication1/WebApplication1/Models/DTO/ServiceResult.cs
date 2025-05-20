namespace WebApplication1.Models.DTO
{
    public class ServiceResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int? ErrorCode { get; set; }
        public object? Data { get; set; }
    }
    public class ActivityResult
    {
        public bool IsActive { get; set; }
    }
}
