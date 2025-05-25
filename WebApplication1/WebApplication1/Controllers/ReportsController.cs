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


        /*private MyContext context = new MyContext();

        [HttpPost("create-report")]
        public JsonResult CreateReport(Report_Log report)
        {
            if (report.Id == 0)
            {
                context.Report_Log.Add(report);
            }
            else
            {
                var reportInDB = context.Report_Log.Find(report);

                if (reportInDB != null)
                    return new JsonResult(BadRequest());

                context.Report_Log.Add(report);
            }

            context.SaveChanges();

            return new JsonResult(Ok(report));
        }

        [HttpPut("ban-user")]
        public JsonResult BanUser(int userId, DateTime banEnd)
        {
            try
            {
                context.User.Where(x => x.Id == userId).First().Ban_End = banEnd;

                context.SaveChanges();

                return new JsonResult(Ok());
            }
            catch
            {
                throw new Exception("User couldnt be banned");
            }
        }

        [HttpPut("timeout-user")]
        public JsonResult TimeoutUser(int userId, DateTime timeoutEnd)
        {
            try
            {
                context.User.Where(x => x.Id == userId).First().Timeout_End = timeoutEnd;

                context.SaveChanges();

                return new JsonResult(Ok());
            }
            catch
            {
                throw new Exception("User couldnt be timed out");
            }
        }

        [HttpDelete("ignore-report")]
        public JsonResult IgnoreReport(Report_Log report)
        {
            try
            {
                context.Report_Log.Remove(report);

                context.SaveChanges();

                return new JsonResult(Ok());
            }
            catch
            {
                throw new Exception("Report couldnt be deleted");
            }
        }

        [HttpGet("get-all-reports")]
        public IActionResult GetAll()
        {
            return Ok(context.Report_Log);
        }

        [HttpGet("get-all-reports-user-id")]
        public IActionResult GetAllUserId(int Id)
        {
            return Ok(context.Report_Log.Where(x => x.User_Id == Id));
        }

        [HttpGet("reportsCount-user{id}")]
        public IActionResult GetUserReportsCount(int id)
        {
            return Ok(context.Report_Log.Where(x => x.User_Id == id).Count());
        }

        [HttpGet("reportsCount-AllUsers")]
        public IActionResult GetAllUserReportsCount()
        {
            var counts = context.Report_Log.GroupBy(x => x.User_Id)
                .Select(x => new { UserId = x.Key, Count = x.Count() }).ToList();

            return Ok(counts);
        }*/
    }
}
