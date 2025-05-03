using System.Text.RegularExpressions;
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

        private bool IsLinkRegex(string content)
        {
            return Regex.IsMatch(content, @"^(https?://)?www(\.[a-zA-Z0-9]{2,})+(/[a-zA-Z0-9_\-/]*)?$");
        }

        private Message CreateMesage(int user_id, int chat_id, string content, int reply_to)
        {
            return new()
            {
                User_Id = user_id,
                Chat_Id = chat_id,
                Content = content,
                URL_Link = IsLinkRegex(content) ? content : "",
                Is_Edited = false,
                Is_Pinned = false,
                Is_Single_Use = false,
                Time = DateTime.UtcNow,
                Previous_Message_Id = reply_to
            };
        }

        [HttpPost("send-message")]
        public JsonResult SendMessage(int user_id, int chat_id, string content, int reply_to)
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