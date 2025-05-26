using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Bcpg;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : MainController
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpPost("send-report")]
        public Task<IActionResult> SendReport([FromBody] CreateReportDTO dto)
            => HandleService(() => _reportService.SendReportAsync(dto));

        [HttpPut("timeout-user")]
        public Task<IActionResult> TimeoutUser([FromBody] UseReportDTO dto)
            => HandleService(() => _reportService.UseReportAsync(dto, "timeout"));

        [HttpPut("ban-user")]
        public Task<IActionResult> BanUser([FromBody] UseReportDTO dto)
            => HandleService(() => _reportService.UseReportAsync(dto, "ban"));

        [HttpGet("get-reports-admin-view-{id}")]
        public Task<IActionResult> ViewReports(int id)
            => HandleService(() => _reportService.ViewReportsAsync(id));

        [HttpGet("get-report-count-of-user-{id}")]
        public Task<IActionResult> GetReportCount(int id)
            => HandleService(() => _reportService.GetReportCountAsync(id));

        [HttpDelete("delete-report-{userId}-{reportId}")]
        public Task<IActionResult> DeleteReport(int userId, int reportId)
            => HandleService(() => _reportService.UseReportAsync(new UseReportDTO { userId = userId, reportId = reportId }, "remove"));
    }
}
