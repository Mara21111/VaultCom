using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly Services.Interfaces.IAuthenticationService _authService;

        public AuthenticationController(Services.Interfaces.IAuthenticationService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);

            if (result.Success)
            {
                return Ok(new { token = result.Token });
            }

            return Unauthorized(new { message = result.Message });
        }
    }
}
