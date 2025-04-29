using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private MyContext context = new MyContext();

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
            return Ok(this.context.Report_Log);
        }
    }
}
