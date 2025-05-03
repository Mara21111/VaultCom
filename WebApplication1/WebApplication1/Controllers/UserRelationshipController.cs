using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using MySql.Data.MySqlClient;
using System.Data.SqlClient;
using System.Linq;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRelationshipController : ControllerBase
    {
        private MyContext context = new MyContext();

        private User_Relationship CreateRelationship(int id1, int id2)
        {
            return new User_Relationship()
            {
                User_Id = id1,
                Friend_User_Id = id2,
                Is_Blocked = false,
                Is_Muted = false,
                Is_Friend = false,
                Pending = false,
                Nickname = ""
            };
        }

        private int GetID(int id1, int id2)
            => context.User_Relationship.Where(x => x.User_Id == id1 && x.Friend_User_Id == id2).First().Id;

        private bool Exists(int id1, int id2)
        {
            return context.User_Relationship.Where(x => x.User_Id == id1 && x.Friend_User_Id == id2).Any();
        }


        [HttpPost("send-request-from{sender_id}-to{other_id}")]
        public JsonResult SendRequest(int sender_id, int other_id)
        {
            User_Relationship? rel = new();

            if (!Exists(sender_id, other_id))
            {
                rel = CreateRelationship(sender_id, other_id);
                rel.Pending = true;
                context.User_Relationship.Add(rel);
                context.SaveChanges();
            }
            rel = context.User_Relationship.Find(GetID(sender_id, other_id));
            
            if (rel.Is_Friend)
            {
                return new JsonResult(BadRequest("users are friends already"));
            }

            rel.Pending = true;
            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        // fixnout ze v jsonu vraci nejakej server error, ale jinak funguje
        [HttpPost("accept-request-from{acceptor_id}-to{requestor_id}")]
        public JsonResult AcceptRequest(int acceptor_id, int requestor_id) 
        {
            if (!Exists(requestor_id, acceptor_id))
            {
                return new JsonResult(BadRequest($"relation from user {requestor_id} to {acceptor_id} does not exist"));
            }
            User_Relationship? rel = context.User_Relationship.Find(GetID(requestor_id, acceptor_id));
            
            if (!rel.Pending)
            {
                return new JsonResult(BadRequest($"there is no pending request from user {requestor_id}"));
            }

            rel.Pending = false;
            rel.Is_Friend = true;
            context.SaveChanges();

            User_Relationship? rel2 = new();
            if (!Exists(acceptor_id, requestor_id))
            {
                rel2 = CreateRelationship(acceptor_id, requestor_id);
                rel2.Is_Friend = true;
                context.User_Relationship.Add(rel2);
            }
            else
            {
                rel2 = context.User_Relationship.Find(GetID(acceptor_id, requestor_id));
                rel2.Is_Friend = true;
            }

            context.SaveChanges();
            return new JsonResult(Ok(rel), Ok(rel2));
        }

        [HttpPost("reject-request-from{rejector_id}-to{requestor_id}")]
        public JsonResult RejectRequest(int rejector_id, int requestor_id)
        {
            if (!Exists(requestor_id, rejector_id))
            {
                return new JsonResult(BadRequest($"relation from user {requestor_id} to {rejector_id} does not exist"));
            }
            User_Relationship? rel = context.User_Relationship.Find(GetID(requestor_id, rejector_id));

            rel.Pending = false;
            // basically smazat prazdny relation
            if (!rel.Is_Friend && !rel.Is_Blocked && !rel.Is_Muted)
            {
                context.User_Relationship.Remove(rel);
            }

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        [HttpPost("toggle-block-user-{other_id}")]
        public JsonResult ToggleBlockUser(int id, int other_id)
        {
            User_Relationship? rel = new();
            if (!Exists(id, other_id))
            {
                rel = CreateRelationship(id, other_id);
                rel.Is_Blocked = true;
            }
            else if (rel.Is_Blocked && !rel.Is_Friend && !rel.Is_Muted)
            {
                context.User_Relationship.Remove(context.User_Relationship.Find(GetID(id, other_id)));
            }
            else
            {
                rel = context.User_Relationship.Find(GetID(id, other_id));
                rel.Is_Blocked = !rel.Is_Blocked;
            }

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }


        [HttpGet("get-friends-of-user{id}")]
        public IActionResult GetFriends(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.Friend_User_Id == id && x.Is_Friend).Select(x => x.User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("pending-requests-to-user{id}")]
        public IActionResult GetPendingRequests(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.Friend_User_Id == id).Select(x => x.User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            return Ok(context.User_Relationship);
        }
    }
}
