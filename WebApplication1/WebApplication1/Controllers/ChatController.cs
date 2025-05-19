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
    public class ChatController : MainController
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("get-all-public-chats")]
        public Task<IActionResult> GetAllPublicChats()
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { Type = 1 }));

        [HttpGet("search-for-chat-{id}-{prompt}")]
        public Task<IActionResult> SearchForChat(int id, string prompt)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Prompt = prompt }));

        [HttpGet("get-chats-user-is-in-{id}")]
        public Task<IActionResult> GetChatsUserIsIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id }));

        [HttpGet("get-public-chats-user-is-in-{id}")]
        public Task<IActionResult> GetPublicChatsUserIsIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 1 }));

        [HttpGet("get-public-chats-user-is-not-in-{id}")]
        public Task<IActionResult> GetPublicChatsUserIsNotIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = false, RequestorId = id, Type = 1 }));

        [HttpGet("get-public-chats-user-has-muted-{id}")]
        public Task<IActionResult> GetPublicChatsUserHasMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 1, IsMuted = true }));

        [HttpGet("get-public-chats-user-has-not-muted-{id}")]
        public Task<IActionResult> GetPublicChatsUserHasNotMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 1, IsMuted = false }));

        [HttpGet("get-group-chats-user-is-in-{id}")]
        public Task<IActionResult> GetGroupChatsUserIsIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 2 }));

        [HttpGet("get-group-chats-user-has-muted-{id}")]
        public Task<IActionResult> GetGroupChatsUserHasMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 2, IsMuted = true }));

        [HttpGet("get-group-chats-user-has-not-muted-{id}")]
        public Task<IActionResult> GetGroupChatsUserHasNotMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 2, IsMuted = false }));

    }
}