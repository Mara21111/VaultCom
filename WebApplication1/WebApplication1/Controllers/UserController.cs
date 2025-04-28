using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using System.Linq;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPost("create-user")]
        public JsonResult CreateUser(User user)
        {
            if (context.User.Where(x => x.UserName == user.UserName).Any())
            {
                return new JsonResult(StatusCode(1, "This username is already taken."));
            }
            else if (context.User.Where(x => x.Email == user.Email).Any())
            {
                return new JsonResult(StatusCode(1, "This email already exists."));
            }

            context.User.Add(user);

            context.SaveChanges();

            return new JsonResult(Ok(user));
        }

        [HttpPut("edit-user")]
        public JsonResult EditUser(User user)
        {
            context.User.Where(x => x.Id == user.Id).First().UserName = user.UserName;
            context.User.Where(x => x.Id == user.Id).First().Email = user.Email;
            context.User.Where(x => x.Id == user.Id).First().Password = user.Password;

            context.SaveChanges();

            return new JsonResult(Ok(user));
        }

        [HttpGet("user-{id}")]
        public IActionResult GetUser(int id)
        {
            return Ok(context.User.Where(x => x.Id == id));
        }

        [HttpGet("all-users")]
        public IActionResult GetAllUsers()
        {
            try
            {
                // bere usery jinym zpusobem kinda
                var users = context.User.Select(user => new { user.Id, user.UserName }).ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(-1, "ajajaj neco se posralo (tenhle error se za zadnych okolnosti nema objevit)");
            }
        }

        [HttpGet("banned-users")]
        public IActionResult GetBannedUsers()
        {
            //NEFUNGUJE CHECK PRO NULL?? rika ze to nemuze bejt null prej nikdy ale potom tady vrati null a spadne to...
            //return Ok(context.User.Where(x => !x.Ban_End?.HasValue).Select(user => new { user.Id, user.UserName }).ToList());
            return Ok();
        }

        [HttpGet("timeouted-users")]
        public IActionResult GetTimeOutedUsers()
        {
            //tady uplne to samy co nahore
            return Ok(context.User.Where(x => x.Timeout_End != null).Select(user => new { user.Id, user.UserName }).ToList());
        }

        [HttpGet("online")]
        public IActionResult GetOnlineUsers()
        {
            return Ok(context.User.Where(x => x.Status == 2).Select(user => new { user.Id, user.UserName }).ToList());
        }
    }
}
