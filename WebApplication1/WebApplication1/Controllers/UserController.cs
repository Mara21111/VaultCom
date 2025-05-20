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
    public class UserController : MainController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }


        [HttpPost("create-user")]
        public Task<IActionResult> CreateUser([FromBody] CreateUserDTO dto)
            => HandleService(() => _userService.CreateUserAsync(dto));

        [HttpPut("edit-user")]
        public Task<IActionResult> EditUser([FromBody] EditUserDTO dto)
            => HandleService(() => _userService.EditUserAsync(dto));

        [HttpPost("upload-pfp")]
        public Task<IActionResult> UploadPFP([FromForm] ProfilePictureDTO dto)
            => HandleService(() => _userService.UploadPFPAsync(dto));

        [HttpPut("toggle-user-setting")]
        public Task<IActionResult> ToggleUserSetting([FromBody] UserToggleDTO dto)
            => HandleService(() => _userService.ToggleUserSettingAsync(dto));

        [HttpDelete("delete-user-{requestorId}-{targetId}")]
        public Task<IActionResult> DeleteUser(int requestorId, int targetId)
            => HandleService(() => _userService.DeleteUserAsync(requestorId, targetId));

        [HttpGet("get-all-users-admin-view")]
        public Task<IActionResult> GetAllUsersAdminView() 
            => HandleService(() => _userService.GetAllUsersAdminViewAsync());

        [HttpGet("get-all-users")]
        public Task<IActionResult> GetAllUsers() 
            => HandleService(() => _userService.GetUsers(null));

        [HttpGet("get-banned-users")]
        public Task<IActionResult> GetBannedUsers() 
            => HandleService(() => _userService.GetUsers(new UserFilterDTO { Banned = true }));

        [HttpGet("get-timeouted-users")]
        public Task<IActionResult> GetTimeOutedUsers() 
            => HandleService(() => _userService.GetUsers(new UserFilterDTO { TimeOut = true }));

        [HttpGet("get-good-users")]
        public Task<IActionResult> GetGoodUsers() 
            => HandleService(() => _userService.GetUsers(new UserFilterDTO { Banned = false, TimeOut = false }));

        [HttpGet("get-online-users")]
        public Task<IActionResult> GetOnlineUsers()
            => HandleService(() => _userService.GetUsers(new UserFilterDTO { Status = true }));

        [HttpGet("get-user-{id}")]
        public Task<IActionResult> GetUser(int id) 
            => HandleService(() => _userService.GetUserAsync(id));

        [HttpGet("get-self-user-{id}")]
        public Task<IActionResult> GetSelfUser(int id)
            => HandleService(() => _userService.GetSelfUserAsync(id));

        [HttpGet("get-pfp-{id}")]
        public Task<IActionResult> GetPFP(int id)
            => HandleService(() => _userService.GetPFPAsync(id));


        private async Task<IActionResult> HandleActivity(Func<Task<ActivityResult>> serviceCall)
        {
            var result = await serviceCall();
            return Ok(result.IsActive);
        }

        [HttpPost("set-activity")]
        public Task<IActionResult> SetActivity(int id)
            => HandleActivity(() => _userService.SetActivityAsync(id));

        [HttpGet("get-activity")]
        public Task<IActionResult> GetActivity(int id)
            => HandleActivity(() => _userService.IsUserOnlineAsync(id));
    }
}

/*
 * dobrej input pro chatgpt:
no bullshit, use angular, .net, mysql, every step to make pfps work from how theyre stored in database, created from frontend upload to backend, stored as a path to WebApplication1/wwwroot/uploads/pfps/default.png to getting it and stuff, also mostly C# .net code coz i dont work with angular AT ALL, app structure is as follows: app1/controllers takes requests from frontend and sends them to app1/services/interfaces which are implemented in app1/services/implementations and all the logic is in implementations which uses ServiceResult to send back Success = true, Data = antyhing basically for json Ok() after in controller
 */