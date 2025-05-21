namespace WebApplication1.Models.DTO
{
    public class CreateReportDTO : RequestDTO
    {
        public string message { get; set; }
    }
    public class UseReportDTO
    {
        public int userId {  get; set; }
        public int reportId { get; set; }
        public DateTime? until { get; set; }
    }
}