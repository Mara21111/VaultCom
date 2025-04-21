using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(this.context.Report_Log);
        }
    }
}
