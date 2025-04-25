using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Filters;
using WebApplication1.Services;

namespace WebApplication1.Controllers
{
    public class SecuredAttribute : Attribute, IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            TokenService service = new TokenService();

            ControllerBase controller = context.Controller as ControllerBase;
            string header = controller.Request.Headers["Authorization"];

            if (!service.Verify(header))
            {
                context.Result = controller.Unauthorized(new { message = "Authorization failed" });
            }
        }
    }
}
