using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserChatRelationshipController : MainController
    {
        private readonly IUserChatRelationshipService _UCRService;

        public UserChatRelationshipController(IUserChatRelationshipService UCRService)
        {
            _UCRService = UCRService;
        }

        [HttpPost("join-public-chat")]
        public Task<IActionResult> JoinPublicChat(UserChatRelationshipDTO dto)
            => HandleService(() => _UCRService.JoinPublicChatAsync(dto));

        [HttpPut("mute-chat-toggle")]
        public Task<IActionResult> MuteChatToggle(UserChatRelationshipDTO dto)
            => HandleService(() => _UCRService.MuteChatToggleAsync(dto));

        [HttpGet("get-users-in-chat-{id}")]
        public Task<IActionResult> GetUsersInChat(int id)
            => HandleService(() => _UCRService.GetUsersInChatAsync(id));

        [HttpDelete("leave-public-chat-{userId}-{chatId}")]
        public Task<IActionResult> LeavePublicChat(int userId, int chatId)
            => HandleService(() => _UCRService.LeavePublicChatAsync(new UserChatRelationshipDTO { ChatId = chatId, UserId = userId}));
    }
}
