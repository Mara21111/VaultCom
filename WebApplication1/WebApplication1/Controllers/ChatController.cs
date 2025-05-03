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

        [HttpDelete("delete-chat")]
        public JsonResult DeleteChat(int ID)
        {
            try
            {
                Chat chat = context.Chat.Where(x => x.Id == ID).FirstOrDefault();

                context.Chat.Remove(chat);

                context.SaveChanges();

                return new JsonResult(Ok(chat));
            }
            catch
            {
                throw new Exception("Reaction could not be removed because it does not exist");
            }
        }

        [HttpPut("edit-name")]
        public JsonResult EditChatName(int chatId, string newChatName)
        {
            try
            {
                context.Chat.Where(x => x.Id == chatId).First().Name = newChatName;

                context.SaveChanges();

                return new JsonResult(Ok(context.Chat.Where(x => x.Id == chatId).First()));
            }
            catch
            {
                throw new Exception("Reaction could not be removed because it does not exist");
            }
        }

        [HttpPut("edit-description")]
        public JsonResult EditChatDescription(int chatId, string newChatDescription)
        {
            try
            {
                context.Chat.Where(x => x.Id == chatId).First().Description = newChatDescription;

                context.SaveChanges();

                return new JsonResult(Ok(context.Chat.Where(x => x.Id == chatId).First()));
            }
            catch
            {
                throw new Exception("Reaction could not be removed because it does not exist");
            }
        }

        [HttpGet("chat{id}")]
        public IActionResult GetChat(int id)
        {
            return Ok(context.Chat.Where(x => x.Id == id));
        }


        [HttpGet("all-chats")]
        public IActionResult GetAllChats()
        {
            return Ok(context.Chat);
        }

        [HttpGet("all-public-chats")]
        public IActionResult GetAllPublicChats()
        {
            return Ok(context.Chat.Where(x => x.Is_Public == true));
        }
    }
}