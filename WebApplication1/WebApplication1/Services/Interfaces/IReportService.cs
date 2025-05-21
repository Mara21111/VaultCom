using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IReportService
    {
        Task<ServiceResult> SendReportAsync(CreateReportDTO dto);
        Task<ServiceResult> ViewReportsAsync(int id);
        Task<ServiceResult> GetReportCountAsync(int id);
        Task<ServiceResult> DeleteReportAsync(UseReportDTO dto);
    }
}
