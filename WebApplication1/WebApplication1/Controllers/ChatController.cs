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
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        private async Task<IActionResult> HandleService(Func<Task<ServiceResult>> serviceCall)
        {
            var result = await serviceCall();
            return result.Success ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }

        [HttpPost("get-all-public-chats")]
        public Task<IActionResult> GetAllPublicChats()
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { Type = 1 }));

        [HttpPost("get-chats-user-{id}-is-in")]
        public Task<IActionResult> GetChatsUserIsIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id}));

        [HttpPost("get-public-chats-user-{id}-is-in")]
        public Task<IActionResult> GetPublicChatsUserIsIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 1 }));

        [HttpPost("get-public-chats-user-{id}-is-not-in")]
        public Task<IActionResult> GetPublicChatsUserIsNotIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = false, RequestorId = id, Type = 1 }));

        [HttpPost("get-public-chats-user-{id}-has-muted")]
        public Task<IActionResult> GetPublicChatsUserHasMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 1, IsMuted = true }));

        [HttpPost("get-public-chats-user-{id}-has-not-muted")]
        public Task<IActionResult> GetPublicChatsUserHasNotMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 1, IsMuted = false }));

        [HttpPost("get-group-chats-user-{id}-is-in")]
        public Task<IActionResult> GetGroupChatsUserIsIn(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 2 }));

        [HttpPost("get-group-chats-user-{id}-has-muted")]
        public Task<IActionResult> GetGroupChatsUserHasMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 2, IsMuted = true }));

        [HttpPost("get-group-chats-user-{id}-has-not-muted")]
        public Task<IActionResult> GetGroupChatsUserHasNotMuted(int id)
            => HandleService(() => _chatService.GetChatsAsync(new ChatFilterDTO { IsIn = true, RequestorId = id, Type = 2, IsMuted = false }));

    }
}