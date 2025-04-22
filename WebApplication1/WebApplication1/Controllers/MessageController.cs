using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private MyContext context = new MyContext();

        /*[HttpPost]
        public JsonResult CreateMessage(Message message)
        {
            context.Message.Add(message);

            context.SaveChanges();

            return new JsonResult(Ok(message));
        }*/

        [HttpGet]
        public IActionResult GetChat()
        {
            return Ok(context.Message);
        }
    }
}