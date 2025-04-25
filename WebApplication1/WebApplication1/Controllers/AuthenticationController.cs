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
        private MyContext context = new MyContext();

        [HttpPost]
        public IActionResult Login(LoginModel loginModel)
        {
            var user = context.User.FirstOrDefault(x => x.Username == loginModel.Username);

            if (user != null && loginModel.Password == user.Password)
                {
                    string token = this.tokenService.Create(user);

                    return Ok(new { token = token });
                }

            return Unauthorized(new {message = "Invalid username or password"});
        }
    }
}
