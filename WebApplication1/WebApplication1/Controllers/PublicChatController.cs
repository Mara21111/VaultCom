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
    public class PublicChatController : ControllerBase
    {
        private readonly IPublicChatService _chatService;

        public PublicChatController(IPublicChatService chatService)
        {
            _chatService = chatService;
        }

        private async Task<IActionResult> HandleService(Func<Task<ServiceResult>> serviceCall)
        {
            var result = await serviceCall();
            return result.Success ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }

        [HttpPost("create-public-chat")]
        public Task<IActionResult> CreatePublicChat([FromBody] CreatePublicChatDTO dto)
            => HandleService(() => _chatService.CreatePublicChatAsync(dto));
    }
}