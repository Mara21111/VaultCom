using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using static System.Net.Mime.MediaTypeNames;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost("create-message")]
        public JsonResult CreateMessage(Message message)
        {
            if (context.User.Find(message.User_Id) == null)
            {
                return new JsonResult(BadRequest("this user doesn't exist"));
            }
            else if (context.Chat.Find(message.Chat_Id) == null)
            {
                return new JsonResult(BadRequest("this chat doesn't exist"));
            }
            else if (!context.User_Chat.Where(x => x.User_Id == message.User_Id && x.Chat_Id == message.Chat_Id).Any())
            {
                return new JsonResult(BadRequest($"{message.User_Id} user isn't in {message.Chat_Id} chat"));
            }

            context.Message.Add(message);
            context.SaveChanges();

            return new JsonResult(Ok(message));
        }

        [HttpDelete("remove-message")]
        public JsonResult RemoveMessage(Message message)
        {
            try
            {
                context.Message.Remove(message);

                context.SaveChanges();

                return new JsonResult(Ok(message));
            }
            catch
            {
                throw new Exception("Reaction could not be removed because it does not exist");
            }
        }

        [HttpPut("edit-message-content")]
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

        [HttpGet("search-for-message")]
        public IActionResult SearchForMessage(string text)
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

        [HttpGet("get-messages-from-chat{id}")]
        public IActionResult GetMessages(int id)
        {
            return Ok(context.Message.Where(x => x.Chat_Id == id));
        }
    }
}