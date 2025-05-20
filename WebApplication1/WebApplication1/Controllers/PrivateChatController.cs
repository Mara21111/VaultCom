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
    public class PrivateChatController : MainController
    {
        private readonly IPrivateChatService _chatService;

        public PrivateChatController(IPrivateChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("create-private-chat")]
        public Task<IActionResult> CreatePrivatChat([FromBody] UserRelationshipDTO dto)
            => HandleService(() => _chatService.CreatePrivateChatAsync(dto));

        [HttpGet("get-user-ids-in-chat-{id}")]
        public Task<IActionResult> GetUserIds(int id)
            => HandleService(() => _chatService.GetPrivateChatUserIds(id));

        [HttpGet("get-users-in-chat-{id}")]
        public Task<IActionResult> GetUsers(int id)
            => HandleService(() => _chatService.GetPrivateChatUsers(id));
    }
}