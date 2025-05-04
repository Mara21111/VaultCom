using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;
using System;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReactionController : ControllerBase
    {
        /*private MyContext context = new MyContext();

        private string GetReaction(int id)
        {
            string[] lines = File.ReadAllLines(filePath);
            foreach (string line in lines)
            {
                // Example condition: find line containing the word "happy"
                if (line.Contains("happy"))
                {
                    Console.WriteLine("Found line: " + line);
                }
            }
        }

        [HttpPost("add-reaction-")]
        public JsonResult AddReaction(int user_id, int chat_id, string content, int reply_to)
        {
            Message msg = CreateMesage(user_id, chat_id, content, reply_to);

            if (context.User.Find(msg.User_Id) == null)
            {
                return new JsonResult(BadRequest("this user doesn't exist"));
            }
            else if (context.Chat.Find(msg.Chat_Id) == null)
            {
                return new JsonResult(BadRequest("this chat doesn't exist"));
            }
            else if (!context.User_Chat.Where(x => x.User_Id == msg.User_Id && x.Chat_Id == msg.Chat_Id).Any())
            {
                return new JsonResult(BadRequest($"{msg.User_Id} user isn't in {msg.Chat_Id} chat"));
            }

            context.Message.Add(msg);
            context.SaveChanges();

            return new JsonResult(Ok(msg));
        }*/
    }
}
