using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost("create-public-chat")]
        public JsonResult CreatePublicChat(string name, int creator_id, string desc)
        {
            if (!context.User.Find(creator_id).Is_Admin)
            {
                return new JsonResult(BadRequest("chat creator isn't admin"));
            }
            if (context.Chat.Where(x => x.Name == name).Any())
            {
                return new JsonResult(BadRequest("this name already exists"));
            }

            var chat = new Chat()
            {
                Is_Public = true,
                Creator_Id = creator_id,
                Name = name,
                Description = desc
            };
            context.Chat.Add(chat);
            context.SaveChanges();

            chat = context.Chat.Last(); //aby to melo to id po tom sejvu coz jinak to ↓↓ tady nefacha tady (v groupchatech je to samy)
            context.User_Chat.Add(new User_Chat() { User_Id = creator_id, Chat_Id = chat.Id, Muted_Chat = false });
            context.SaveChanges();

            return new JsonResult(Ok(chat));
        }

        // predat sem neco jako "34;66;2" -> znamena ze se tam pridaj useri 34 66 a 2
        [HttpPost("create-group-chat")]
        public JsonResult CreateChat(int creator_id, string ids_string)
        {
            List<string> split_ids = ids_string.Split(';').ToList();
            List<int> user_ids = new List<int>();
            foreach (var item in split_ids)
            {
                user_ids.Add(Convert.ToInt32(item));
            }

            var chat = new Chat()
            {
                Is_Public = false,
                Creator_Id = creator_id,
                Name = $"{context.User.Find(creator_id).Username}'s gruop chat",
                Description = ""
            };

            context.Chat.Add(chat);
            context.SaveChanges();

            chat = context.Chat.OrderBy(x => x.Id).Last();
            context.User_Chat.Add(new User_Chat() { User_Id = creator_id, Chat_Id = chat.Id, Muted_Chat = false });
            foreach (var user_id in user_ids)
            {
                context.User_Chat.Add(new User_Chat() { User_Id = user_id, Chat_Id = chat.Id, Muted_Chat = false });
            }

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