using System;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupChatController : MainController
    {
        private readonly IGroupChatService _chatService;

        public GroupChatController(IGroupChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("create-group-chat")]
        public Task<IActionResult> CreateGroupChat([FromBody] CreateGroupChatDTO dto)
            => HandleService(() => _chatService.CreateGroupChatAsync(dto));

        [HttpDelete("delete-group-chat-{userId}-{chatId}")]
        public Task<IActionResult> DeleteGroupChat(int userId, int chatId)
            => HandleService(() => _chatService.DeleteGroupChatAsync(new UserChatRelationshipDTO { UserId = userId, ChatId = chatId }));
    }
}