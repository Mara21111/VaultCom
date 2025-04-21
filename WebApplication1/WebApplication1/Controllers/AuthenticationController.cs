using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private TokenService tokenService = new TokenService();

        [HttpPost]
        public IActionResult Login(User user)
        {
            if (user.UserName == "pavel" && user.Password == "test")
            {
                string token = this.tokenService.Create(user);

                return Ok(new { token = token });
            }

            return Unauthorized(new {message = "Invalid username or password"});
        }
    }
}
