using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost]
        public JsonResult CreateUser(User user)
        {
            context.User.Add(user);

            context.SaveChanges();

            return new JsonResult(Ok(user));
        }

        /*[HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(context.User);
        }*/
    }
}
