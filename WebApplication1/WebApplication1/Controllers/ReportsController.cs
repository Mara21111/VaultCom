using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost]
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

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(this.context.Report_Log);
        }
    }
}
