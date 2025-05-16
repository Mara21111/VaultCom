using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Implementations;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        private async Task<IActionResult> HandleService(Func<Task<ServiceResult>> serviceCall)
        {
            var result = await serviceCall();
            return result.Success ? Ok(result.Data) : BadRequest(result.ErrorMessage);
        }


        [HttpPost("create-user")]
        public Task<IActionResult> CreateUser([FromBody] CreateUserDTO dto)
            => HandleService(() => _userService.CreateUserAsync(dto));

        [HttpPut("edit-user")]
        public Task<IActionResult> EditUser([FromBody] EditUserDTO dto)
            => HandleService(() => _userService.EditUserAsync(dto));

        [HttpPut("toggle-user-setting")]
        public Task<IActionResult> ToggleUserSetting([FromBody] UserToggleDTO dto)
            => HandleService(() => _userService.ToggleUserSettingAsync(dto));

        [HttpDelete("delete-user-{requestorId}-{targetId}")]
        public Task<IActionResult> DeleteUser(int requestorId, int targetId)
            => HandleService(() => _userService.DeleteUserAsync(requestorId, targetId));

        [HttpGet("get-all-users-admin-view")]
        public Task<IActionResult> GetAllUsersAdminView() =>
    HandleService(() => _userService.GetAllUsersAdminViewAsync());

        [HttpGet("get-all-users")]
        public Task<IActionResult> GetAllUsers() =>
            HandleService(() => _userService.GetUsers(null));

        [HttpGet("get-banned-users")]
        public Task<IActionResult> GetBannedUsers() =>
            HandleService(() => _userService.GetUsers(new UserFilterDTO { Banned = true }));

        [HttpGet("get-timeouted-users")]
        public Task<IActionResult> GetTimeOutedUsers() =>
            HandleService(() => _userService.GetUsers(new UserFilterDTO { TimeOut = true }));

        [HttpGet("get-good-users")]
        public Task<IActionResult> GetGoodUsers() =>
            HandleService(() => _userService.GetUsers(new UserFilterDTO { Banned = false, TimeOut = false }));

        [HttpGet("get-online-users")]
        public Task<IActionResult> GetOnlineUsers()
            => HandleService(() => _userService.GetUsers(new UserFilterDTO { Status = 1 }));

        [HttpGet("get-user-{id}")]
        public Task<IActionResult> GetUser(int id) =>
            HandleService(() => _userService.GetUserAsync(id));

        [HttpGet("get-self-user-{id}")]
        public Task<IActionResult> GetSelfUser(int id)
            => HandleService(() => _userService.GetSelfUserAsync(id));
    }
}
