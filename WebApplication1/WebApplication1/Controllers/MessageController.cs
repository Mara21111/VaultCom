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

        [HttpPost]
        public JsonResult CreateMessage(Message message)
        {
            context.Message.Add(message);

            context.SaveChanges();

            return new JsonResult(Ok(message));
        }

        [HttpPost("edit-message-content")]
        public JsonResult EditMessageContent(Message message)
        {
            context.Message.Where(x => x.Id == message.Id).First().Content = message.Content;

            context.SaveChanges();

            return new JsonResult(Ok(message));
        }

        [HttpGet("message-{id}")]
        public IActionResult GetMessage(string text)
        {
            return Ok(context.Message.Where(x => x.Content.StartsWith(text)));
        }

        [HttpGet("get-all-chats")]
        public IActionResult GetAllChats()
        {
            return Ok(context.Message);
        }
    }
}