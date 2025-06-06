using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;
using static System.Net.Mime.MediaTypeNames;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : MainController
    {
        private readonly IMessageService _messageService;

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost("send-message")]
        public Task<IActionResult> SendMessage([FromBody] MessageDTO dto) 
            => HandleService(() => _messageService.SendMessageAsync(dto));

        [HttpPut("pin-message-{userId}-{messageId}")]
        public Task<IActionResult> PinMessage(int userId, int messageId)
            => HandleService(() => _messageService.EditMessageAsync(new MessageEditDTO { UserId = userId, MessageId = messageId, Pin = true}));

        [HttpPut("edit-message-{userId}-{messageId}-{newContent}")]
        public Task<IActionResult> EditMessage(int userId, int messageId, string newContent)
            => HandleService(() => _messageService.EditMessageAsync(new MessageEditDTO { UserId = userId, MessageId = messageId, NewContent = newContent }));

        [HttpGet("get-messages-in-chat-{userId}-{chatId}")]
        public Task<IActionResult> GetMessagesFromChat(int userId, int chatId)
            => HandleService(() => _messageService.GetMessagesInChatAsync(userId, chatId, true));

        [HttpDelete("delete-message-{userId}-{messageId}")]
        public Task<IActionResult> DeleteMessage(int userId, int messageId)
            => HandleService(() => _messageService.DeleteMessageAsync(userId, messageId));
    }
}