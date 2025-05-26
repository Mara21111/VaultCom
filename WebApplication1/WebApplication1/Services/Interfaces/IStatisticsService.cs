using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;

namespace WebApplication1.Services.Interfaces
{
    public interface IStatisticsService
    {
        Task<ServiceResult> GetTableCountsAsync();
    }
}