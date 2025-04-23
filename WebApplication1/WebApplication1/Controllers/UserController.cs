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

        [HttpPost]
        public JsonResult CreateUser(User user)
        {
            context.User.Add(user);

            context.SaveChanges();

            return new JsonResult(Ok(user));
        }

        [HttpGet("all")]
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

        [HttpGet("banned")]
        public IActionResult GetBannedUsers()
        {
            //NEFUNGUJE CHECK PRO NULL?? rika ze to nemuze bejt null prej nikdy ale potom tady vrati null a spadne to...
            //return Ok(context.User.Where(x => !x.Ban_End?.HasValue).Select(user => new { user.Id, user.UserName }).ToList());
            return Ok();
        }

        [HttpGet("timeouted")]
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
