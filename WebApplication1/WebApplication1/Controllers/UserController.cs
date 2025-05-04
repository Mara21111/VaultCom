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
            if (context.User.Where(x => x.Username == user.Username).Any())
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

        [HttpPut("edit-user{id}")]
        public IActionResult EditUser(int id, User user)
        {
            User us = context.User.Find(id);

            if (us == null)
            {
                return NotFound("User not found.");
            }

            if (this.context.User.Any(x => x.Username == user.Username && x.Id != id))
            {
                return Conflict("Username already in user");
            }

            if (this.context.User.Any(x => x.Phone_Number == user.Phone_Number && x.Id != id))
            {
                return Conflict("Phone number already in user");
            }

            if (this.context.User.Any(x => x.Email == user.Email && x.Id != id))
            {
                return Conflict("Email already in user");
            }

            us.Phone_Number = user.Phone_Number;
            us.Email = user.Email;
            us.Username = user.Username;
            us.Bio = user.Bio;
            us.Password = user.Password;
            us.Is_Public = user.Is_Public;
            us.Safe_Mode = user.Safe_Mode;

            /*context.User.Where(x => x.Id == user.Id).First().Username = user.Username;
            context.User.Where(x => x.Id == user.Id).First().Email = user.Email;
            context.User.Where(x => x.Id == user.Id).First().Password = user.Password;
            context.User.Where(x => x.Id == user.Id).First().Phone_Number = user.Phone_Number;*/

            context.SaveChanges();

            return Ok(us);
        }

        [HttpDelete("delete-user")]
        public JsonResult DeleteUser(User user)
        {
            try
            {
                context.Remove(user);

                context.SaveChanges();

                return new JsonResult(Ok(user));
            }
            catch
            {
                throw new Exception("User couldnt have been deleted");
            }
        }


        [HttpGet("user{id}")]
        public IActionResult GetUser(int id)
        {
            return Ok(context.User.FirstOrDefault(x => x.Id == id));
        }

        [HttpGet("all-users")]
        public IActionResult GetAllUsers()
        {
            //try
            //{
            //    // bere usery jinym zpusobem kinda
            //    var users = context.User.Select(user => new { user.Id, user.UserName }).ToList();
            //    return Ok(users);
            //}
            //catch (Exception ex)
            //{
            //    return StatusCode(-1, "ajajaj neco se posralo (tenhle error se za zadnych okolnosti nema objevit)");
            //}

            return Ok(context.User);
        }

        [HttpGet("banned-users")]
        public IActionResult GetBannedUsers()
        {
            return Ok(context.User.Where(x => x.Ban_End.Value != null));
        }

        [HttpGet("timeouted-users")]
        public IActionResult GetTimeOutedUsers()
        {
            return Ok(context.User.Where(x => x.Timeout_End.Value != null));
        }

        [HttpGet("good-users")]
        public IActionResult GetGoodUsers()
        {
            return Ok(context.User.Where(x => x.Timeout_End.Value == null && x.Ban_End.Value == null));
        }

        [HttpGet("online")]
        public IActionResult GetOnlineUsers()
        {
            return Ok(context.User.Where(x => x.Status == 2).Select(user => new { user.Id, user.Username }).ToList());
        }
    }
}
