using System;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Models.Data;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        /*private MyContext context = new MyContext();

        private Chat CreateChat(int user_id, string name)
        {
            return new()
            {
                Creator_Id = user_id,
                Name = name,
                Is_Public = false
            };
        }

        [HttpPost("create-public-chat")]
        public JsonResult CreatePublicChat(Chat chat)
        {*/
            /*if (!context.User.Find(creator_id).Is_Admin)
            {
                return new JsonResult(BadRequest("chat creator isn't admin"));
            }
            if (context.Chat.Where(x => x.Name == name).Any())
            {
                return new JsonResult(BadRequest("this name already exists"));
            }*/

            //var chat = CreateChat(creator_id, name);
            /*chat.Is_Public = true;

            context.Chat.Add(chat);
            context.SaveChanges();

            context.User_Chat.Add(new User_Chat() { User_Id = chat.Creator_Id, Chat_Id = chat.Id, Muted_Chat = false });
            context.SaveChanges();

            return new JsonResult(Ok(chat));
        }

        // predat sem neco jako "34;66;2" -> znamena ze se tam pridaj useri 34 66 a 2
        [HttpPost("create-group-chat")]
        public JsonResult CreateGroupChat(int creator_id, string ids_string)
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
                Name = $"{context.User.Find(creator_id).Username}'s group chat",
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

        [HttpPost("cerate-dm")]
        public JsonResult CreateDM(int user_id, int other_id)
        {
            if (context.User.Find(user_id) is null || context.User.Find(other_id) is null)
            {
                return new JsonResult(BadRequest("something went wrong..."));
            }

            var chat = new Chat()
            {
                Is_Public = false
            };

            context.Chat.Add(chat);
            context.SaveChanges();

            chat = context.Chat.Last();
            context.User_Chat.Add(new() { Chat_Id = chat.Id, User_Id = user_id });
            context.User_Chat.Add(new() { Chat_Id = chat.Id, User_Id = other_id });
            context.SaveChanges();
            return new JsonResult(Ok(chat));
        }

        [HttpDelete("delete-chat-{chat_id}-{user_id}")]
        public JsonResult DeleteChat(int chat_id, int user_id)
        {
            var chat = context.Chat.Find(chat_id);
            var user = context.User.Find(user_id);

            /*
            if (chat is null)
            {
                return new JsonResult(BadRequest("chat doesn't exist"));
            }
            if (!user.Is_Admin && user.Id != chat.Creator_Id)
            {
                return new JsonResult(BadRequest("cannot delete chat"));
            }*/

            /*new UserChatController().RemoveUsersFromChat(chat_id);

            context.Chat.Remove(chat);
            context.SaveChanges();
            return new JsonResult(Ok(chat));
        }

        [HttpPut("edit-name")]
        public JsonResult EditChatName(int chat_id, int user_id, string new_name)
        {
            var chat = context.Chat.Find(chat_id);
            var user = context.User.Find(user_id);

            if (chat is null)
            {
                return new JsonResult(BadRequest("chat doesn't exist"));
            }
            if (user.Id != chat.Creator_Id)
            {
                return new JsonResult(BadRequest("no permissions for this action"));
            }

            chat.Name = new_name;
            context.SaveChanges();
            return new JsonResult(Ok(chat));
        }

        [HttpPut("edit-description")]
        public JsonResult EditChatDescription(int chat_id, int user_id, string new_desc)
        {
            var chat = context.Chat.Find(chat_id);
            var user = context.User.Find(user_id);

            if (chat is null)
            {
                return new JsonResult(BadRequest("chat doesn't exist"));
            }
            if (user.Id != chat.Creator_Id)
            {
                return new JsonResult(BadRequest("no permissions for this action"));
            }

            chat.Description = new_desc;
            context.SaveChanges();
            return new JsonResult(Ok(chat));
        }

        [HttpGet("chat{id}")]
        public IActionResult GetChat(int id)
        {
            return Ok(context.Chat.Where(x => x.Id == id));
        }


        [HttpGet("all-public-chats")]
        public IActionResult GetAllPublicChats()
        {
            return Ok(context.Chat.Where(x => x.Is_Public == true));
        }

        [HttpGet("seach-for-chat-{prompt}-{user_id}")]
        public IActionResult SearchForChat(string prompt, int user_id)
        {
            var chat_id = context.User_Chat.Where(x => x.User_Id == user_id).Select(x => x.Id);
            return new JsonResult(context.Chat.Where(x => chat_id.Contains(x.Id) && x.Name.Contains(prompt)).ToList());
        }*/
    }
}