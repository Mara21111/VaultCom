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
        public JsonResult EditMessageContent(int id, string content)
        {
            try
            {
                context.Message.Where(x => x.Id == id).First().Content = content;

                context.SaveChanges();

                return new JsonResult(Ok(context.Message.Where(x => x.Id == id)));
            }
            catch
            {
                throw new Exception("Message not found");
            }
        }

        [HttpGet("message-{id}")]
        public IActionResult GetMessage(string text)
        {
            try
            {
                return Ok(context.Message.Where(x => x.Content.StartsWith(text)));
            }
            catch
            {
                return null;
            }
        }

        [HttpGet("get-all-chats")]
        public IActionResult GetAllChats()
        {
            if (context.Message.Count() == 0)
            {
                throw new Exception("No messages found");
            }
            else
            {
                return Ok(context.Message);
            }
        }
    }
}