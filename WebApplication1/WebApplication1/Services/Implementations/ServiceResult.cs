namespace WebApplication1.Services.Implementations
{
    public class ServiceResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int? ErrorCode { get; set; }
        public object? Data { get; set; }
    }
}
