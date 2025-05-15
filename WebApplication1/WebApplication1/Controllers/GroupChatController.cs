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
    public class GroupChatController : ControllerBase
    {
        private readonly IGroupChatService _chatService;

        public GroupChatController(IGroupChatService chatService)
        {
            _chatService = chatService;
        }

        private async Task<IActionResult> HandleService(Func<Task<ServiceResult>> serviceCall)
        {
            var result = await serviceCall();
            return result.Success ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }

        [HttpPost("create-group-chat")]
        public Task<IActionResult> CreateGroupChat([FromBody] CreateGroupChatDTO dto)
            => HandleService(() => _chatService.CreateGroupChatAsync(dto));
    }
}