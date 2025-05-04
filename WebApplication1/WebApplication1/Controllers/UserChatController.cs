using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserChatController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost("create-user-chat-link")]
        public JsonResult CreateUserChat(User_Chat user_chat)
        {
            context.User_Chat.Add(user_chat);
            context.SaveChanges();

            return new JsonResult(Ok(user_chat));
        }

        [HttpDelete("delete-user{userId}-chat{chatId}-link")]
        public JsonResult DeleteUserChat(int userId, int chatId)
        {
            context.User_Chat.Remove(context.User_Chat.Where(x => x.User_Id == userId && x.Chat_Id == chatId).First());
            context.SaveChanges();

            return new JsonResult(Ok("Remove completed"));
        }

        /*[HttpPost("exit-chat")]
        public JsonResult ExitChat(int user_id, int chat_id)
        {
            context.User_Chat.Remove();
            context.SaveChanges();

            return new JsonResult(Ok(user_chat));
        }*/

        [HttpGet("users-in-chat{id}")]
        public IActionResult GetUsersInChat(int id)
        {
            List<int> user_ids = context.User_Chat.Where(x => x.Chat_Id == id).Select(x => x.User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("chats-user{id}-is-in")]
        public IActionResult GetChatsOfUser(int id)
        {
            List<int> chat_ids = context.User_Chat.Where(x => x.User_Id == id).Select(x => x.Chat_Id).ToList();
            return Ok(context.Chat.Where(x => chat_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("public-chats-user{id}-is-in")]
        public IActionResult GetPublicChatsOfUser(int id)
        {
            List<int> chat_ids = context.User_Chat.Where(x => x.User_Id == id).Select(x => x.Chat_Id).ToList();
            return Ok(context.Chat.Where(x => x.Is_Public && chat_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("chat{id}-links")]
        public IActionResult GetUsersLinks(int id)
        {
            return Ok(context.User_Chat.Where(x => x.Chat_Id == id));
        }

        [HttpGet("is-user{userId}-in-chat{chatId}")]
        public IActionResult GetUserInChat(int userId, int chatId)
        {
            return Ok(context.User_Chat.Any(x => x.User_Id == userId && x.Chat_Id == chatId));
        }
    }
}
