using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using static System.Net.Mime.MediaTypeNames;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageInfoController : ControllerBase
    {
        private MyContext context = new MyContext();

        [HttpPut("mark-as-seen")]
        public JsonResult MarkMessageAsSeen(int messageId)
        {
            try
            {
                context.Message_Info.Where(x => x.Id == messageId).First().Seen = true;

                context.SaveChanges();

                return new JsonResult(Ok(context.Message.Where(x => x.Id == messageId)));
            }
            catch
            {
                throw new Exception("Message couldnt be marekd as seen.");
            }
        }
    }
}
