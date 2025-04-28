using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageUserReactionController : Controller
    {
        private MyContext context = new MyContext();

        [HttpPost("reaction-add")]
        public JsonResult AddReaction(Message_User_Reaction reaction)
        {
            try
            {
                context.Message_User_Reaction.Where(x => x.Message_Id == reaction.Message_Id).First().Reaction_Id = reaction.Reaction_Id;
                context.Message_User_Reaction.Where(x => x.Message_Id == reaction.Message_Id).First().User_Id = reaction.User_Id;

                context.SaveChanges();

                return new JsonResult(Ok(reaction));
            }
            catch
            {
                throw new Exception("Reaction couldnt beadded");
            }
        }

        [HttpDelete("reaction-remove")]
        public JsonResult RemoveReaction(Message_User_Reaction reaction)
        {
            try
            {
                context.Message_User_Reaction.Remove(reaction);

                context.SaveChanges();

                return new JsonResult(Ok(reaction));
            }
            catch
            {
                throw new Exception("Reaction could not be removed because it does not exist");
            }
        }
    }
}
