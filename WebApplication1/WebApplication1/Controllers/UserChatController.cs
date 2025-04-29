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


        [HttpGet("get-all-users-in-chat-{id}")]
        public IActionResult GetUsersInChat(int id)
        {
            List<int> user_ids = context.User_Chat.Where(x => x.Chat_Id == id).Select(x => x.User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }
    }
}
