using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost]
        public JsonResult CreateChat(Chat chat)
        {
            context.Chat.Add(chat);

            context.SaveChanges();

            return new JsonResult(Ok(chat));
        }

        [HttpGet]
        public IActionResult GetChat()
        {
            return Ok(context.Chat);
        }
    }
}
