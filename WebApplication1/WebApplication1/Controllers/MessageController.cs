using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
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
        public JsonResult RemoveMessage(int message_id, int user_id)
        {
            Message? msg = context.Message.Find(message_id);
            User? user = context.User.Find(user_id);
            if (msg == null)
            {
                return new JsonResult(BadRequest($"message id:{message_id} doesn't exist"));
            }
            if (user == null)
            {
                return new JsonResult(BadRequest($"user id:{message_id} doesn't exist"));
            }
            if (msg.User_Id != user_id && !user.Is_Admin)
            {
                return new JsonResult(BadRequest("user isn't admin nor are they creator of the message"));
            }
            context.Message.Remove(msg);
            context.SaveChanges();
            return new JsonResult(Ok(msg));
        }

        [HttpPut("edit-message-content")]
        public JsonResult EditMessageContent(int message_id, int user_id, string new_content)
        {
            Message? msg = context.Message.Find(message_id);
            User? user = context.User.Find(user_id);
            if (msg == null)
            {
                return new JsonResult(BadRequest($"message id:{message_id} doesn't exist"));
            }
            if (user == null)
            {
                return new JsonResult(BadRequest($"user id:{message_id} doesn't exist"));
            }
            if (msg.User_Id != user_id)
            {
                return new JsonResult(BadRequest("user isn't creator of the message"));
            }
            msg.Content = new_content;
            context.SaveChanges();
            return new JsonResult(Ok(msg));
        }

        [HttpGet("search-for-message")]
        public IActionResult SearchForMessage(string search_prompt, int chat_id)
        {
            return new JsonResult(context.Message.Where(x => x.Chat_Id == chat_id && x.Content.Contains(search_prompt)).ToList());
        }

        // todo
        [HttpGet("get-messages-from-chat{id}")]
        public IActionResult GetMessages(int id)
        {
            return Ok(context.Message.Where(x => x.Chat_Id == id));
        }

        [HttpGet("get-user-messages-in-chat")]
        public IActionResult GetUserMessagesFromChat(int user_id, int chat_id)
        {
            return Ok(context.Message.Where(x => x.Chat_Id == chat_id && x.User_Id == user_id));
        }

        [HttpGet("get-user-messages-in-public-chats")]
        public IActionResult GetUserMessagesFromPublicChats(int user_id)
        {
            return Ok(context.Message.Where(x => x.User_Id == user_id &&
                context.Chat.Find(x.Chat_Id).Is_Public));
        }
    }
}