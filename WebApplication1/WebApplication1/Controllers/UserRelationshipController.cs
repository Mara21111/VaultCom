using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        private bool Exists(int id1, int id2)
        {
            return context.User_Relationship.Where(x => x.User_Id == id1 && x.Friend_User_Id == id2).Any();
        }


        [HttpPost("create-relationship(uselessquestionmark)")]
        public JsonResult PostRelationship(User_Relationship rel)
        {
            context.User_Relationship.Add(rel);
            context.SaveChanges();

            return new JsonResult(Ok(rel));
        }

        [HttpPost("send-request-from-({sender_id})-to-({other_id})")]
        public JsonResult SendRequest(int sender_id, int other_id)
        {
            User_Relationship rel = new User_Relationship();

            if (!Exists(sender_id, other_id))
            {
                rel = CreateRelationship(sender_id, other_id);
                rel.Pending = true;
                context.User_Relationship.Add(rel);
            }
            else
            {
                rel = context.User_Relationship.Where(x =>
                x.User_Id == sender_id && x.Friend_User_Id == other_id).First();
                rel.Pending = true;
            }

            context.SaveChanges();

            return new JsonResult(Ok(rel));
        }

        [HttpPost("accept-request-from-({acceptor_id})-to-({requestor_id})")]
        public JsonResult AcceptRequest(int acceptor_id, int requestor_id)
        {
            if (!Exists(requestor_id, acceptor_id))
            {
                return new JsonResult(BadRequest($"neexistuje relace od {requestor_id} do {acceptor_id}"));
            }

            int id = context.User_Relationship.Where(x => x.User_Id == requestor_id && x.Friend_User_Id == acceptor_id).First().Id;
            User_Relationship? rel = context.User_Relationship.Find(id);
            
            if (!rel.Pending)
            {
                return new JsonResult(BadRequest("neni pending"));
            }

            rel.Pending = false;
            rel.Is_Friend = true;
            context.SaveChanges();

            User_Relationship rel2 = CreateRelationship(requestor_id, acceptor_id);
            rel2.Is_Friend = true;

            context.User_Relationship.Add(rel2);
            context.SaveChanges();

            return new JsonResult(Ok(rel), Ok(rel2));
        }

        [HttpGet("get-friends-of-user({id})")]
        public IActionResult GetFriends(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.Friend_User_Id == id && x.Is_Friend).Select(x => x.User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("pending-requests-to-user({id})")]
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
