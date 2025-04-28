using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost("create-chat")]
        public JsonResult CreateChat(Chat chat)
        {
            context.Chat.Add(chat);

            context.SaveChanges();

            return new JsonResult(Ok(chat));
        }

        [HttpPost("delete-chat")]
        public JsonResult DeleteChat(Chat chat)
        {
            try
            {
                context.Chat.Remove(chat);

                context.SaveChanges();

                return new JsonResult(Ok(chat));
            }
            catch
            {
                throw new Exception("Reaction could not be removed because it does not exist");
            }
        }

        [HttpGet("chat-{id}")]
        public IActionResult GetChat(int id)
        {
            return Ok(context.Chat.Where(x => x.Id == id));
        }


        [HttpGet("all-chats")]
        public IActionResult GetAllChats()
        {
            return Ok(context.Chat);
        }
    }
}