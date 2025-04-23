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

        [HttpPost]
        public JsonResult CreateUserChat(User_Chat user_chat)
        {
            //tohle se musi vypnout pro save bez primary key (ale nefunguje to
            //context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;

            context.User_Chat.Add(user_chat);
            context.SaveChanges();

            return new JsonResult(Ok(user_chat));
        }
        /*[HttpPost]
        public JsonResult CreateUserChat(User_Chat user_chat)
        {
            if (user_chat == null)
            {
                return new JsonResult("Invalid data") { StatusCode = 400 };
            }

            // Add the new user chat record to the context
            context.User_Chat.Add(user_chat);

            // Save changes to the database
            context.SaveChanges();

            return new JsonResult(Ok(user_chat));
        }*/

        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(context.User_Chat);
        }
    }
}
