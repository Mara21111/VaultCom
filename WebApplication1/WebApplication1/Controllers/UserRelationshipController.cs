using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Ocsp;
using System.Data.SqlClient;
using System.Diagnostics;
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

        private void RemoveFromDatabaseIfDefault(User_Relationship rel)
        {
            if (rel.Is_Friend || rel.Is_Muted || rel.Is_Blocked || rel.Pending)
                return;

            context.User_Relationship.Remove(rel);
        }


        [HttpPost("send-request-from{sender_id}-to{reciever_id}")]
        public JsonResult SendRequest(int sender_id, int reciever_id)
        {
            User_Relationship? rel = new();

            if (!Exists(sender_id, reciever_id))
            {
                rel = CreateRelationship(sender_id, reciever_id);
                rel.Pending = true;
                context.User_Relationship.Add(rel);
                context.SaveChanges();
            }
            rel = context.User_Relationship.Find(GetID(sender_id, reciever_id));
            
            if (rel.Is_Friend)
            {
                return new JsonResult(BadRequest("users are friends already"));
            }

            rel.Pending = true;
            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        // fixnout ze v jsonu vraci nejakej server error, ale jinak funguje
        [HttpPost("accept-request-from{reciever_id}-to{sender_id}")]
        public JsonResult AcceptRequest(int reciever_id, int sender_id) 
        {
            if (!Exists(sender_id, reciever_id))
            {
                return new JsonResult(BadRequest($"relation from user {sender_id} to {reciever_id} does not exist"));
            }
            User_Relationship? rel = context.User_Relationship.Find(GetID(sender_id, reciever_id));
            
            if (!rel.Pending)
            {
                return new JsonResult(BadRequest($"there is no pending request from user {sender_id}"));
            }

            rel.Pending = false;
            rel.Is_Friend = true;
            context.SaveChanges();

            User_Relationship? rel2 = new();
            if (!Exists(reciever_id, sender_id))
            {
                rel2 = CreateRelationship(reciever_id, sender_id);
                rel2.Is_Friend = true;
                context.User_Relationship.Add(rel2);
            }
            else
            {
                rel2 = context.User_Relationship.Find(GetID(reciever_id, sender_id));
                rel2.Is_Friend = true;
            }

            context.SaveChanges();
            return new JsonResult(Ok(rel), Ok(rel2));
        }

        [HttpPost("reject-request-from{reciever_id}-to{sender_id}")]
        public JsonResult RejectRequest(int reciever_id, int sender_id)
        {
            if (!Exists(sender_id, reciever_id))
            {
                return new JsonResult(BadRequest($"relation from user {sender_id} to {reciever_id} does not exist"));
            }
            User_Relationship? rel = context.User_Relationship.Find(GetID(sender_id, reciever_id));

            rel.Pending = false;
            RemoveFromDatabaseIfDefault(rel);

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        [HttpPost("cancel-request-from{sender_id}-to{reciever_id}")]
        public JsonResult CancelRequest(int sender_id, int reciever_id)
        {
            if (!Exists(sender_id, reciever_id))
            {
                return new JsonResult(BadRequest($"relation from user {sender_id} to {reciever_id} does not exist"));
            }
            User_Relationship? rel = context.User_Relationship.Find(GetID(sender_id, reciever_id));

            rel.Pending = false;
            RemoveFromDatabaseIfDefault(rel);

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        [HttpPost("unfriend-{friend_user_id}-from-{user_id}")]
        public JsonResult UnfriendUser(int user_id, int friend_user_id)
        {
            if (!Exists(user_id, friend_user_id))
            {
                return new JsonResult(BadRequest($"relation from user {user_id} to {friend_user_id} does not exist"));
            }
            User_Relationship? rel = context.User_Relationship.Find(GetID(user_id, friend_user_id));

            rel.Is_Friend = false;
            RemoveFromDatabaseIfDefault(rel);

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        // UDELAT ToggleUserFlag JAKO PREFAB PRO VESKERY TOGGLY
        /*[HttpPost("toggle-user-flag-of-user{other_id}")]
        public JsonResult ToggleUserFlag(int id, int other_id, string flagName)
        {
            DebugLog("testgdfgsdgdfgfdgdsf");
            var result = Flag(id, other_id, flagName);
            return new JsonResult(Ok(result));
        }

        private User_Relationship Flag(int id, int other_id, string flagName)
        {
            User_Relationship? rel;

            if (!Exists(id, other_id))
            {
                rel = CreateRelationship(id, other_id);
                SetFlag(rel, flagName, true);
                context.User_Relationship.Add(rel);
                context.SaveChanges();
            }
            rel = context.User_Relationship.Find(GetID(id, other_id));

            SetFlag(rel, flagName, !GetFlag(rel, flagName).Value);

            RemoveFromDatabaseIfDefault(rel);
            context.SaveChanges();

            return rel;
        }

        private bool? GetFlag(User_Relationship rel, string propName)
        {
            var prop = typeof(User_Relationship).GetProperty(propName);
            return prop?.PropertyType == typeof(bool) ? 
                (bool?)prop.GetValue(rel) : null;
        }

        private void SetFlag(User_Relationship rel, string propName, bool value)
        {
            var prop = typeof(User_Relationship).GetProperty(propName);
            if (prop?.PropertyType == typeof(bool) && prop.CanWrite)
            {
                prop.SetValue(rel, value);
            }
        }*/


        [HttpPost("toggle-{user_id}-block-{blocked_user_id}")]
        public JsonResult ToggleBlockUser(int user_id, int blocked_user_id)
        {
            User_Relationship? rel = new();
            if (!Exists(user_id, blocked_user_id))
            {
                rel = CreateRelationship(user_id, blocked_user_id);
                rel.Is_Blocked = true;
                context.User_Relationship.Add(rel);
            }
            else
            {
                rel = context.User_Relationship.Find(GetID(user_id, blocked_user_id));
                rel.Is_Blocked = !rel.Is_Blocked;
            }

            RemoveFromDatabaseIfDefault(rel);
            context.SaveChanges();

            return new JsonResult(rel);
        }

        [HttpPost("toggle-{user_id}-mute-{muted_user_id}")]
        public JsonResult ToggleMuteUser(int user_id, int muted_user_id)
        {
            User_Relationship? rel = new();
            if (!Exists(user_id, muted_user_id))
            {
                rel = CreateRelationship(user_id, muted_user_id);
                rel.Is_Muted = true;
                context.Add(rel);
            }

            rel = context.User_Relationship.Find(GetID(user_id, muted_user_id));
            rel.Is_Muted = !rel.Is_Muted;

            RemoveFromDatabaseIfDefault(rel);

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        [HttpPost("change-{user_id}-nickname-of-{friend_user_id}")]
        public JsonResult ChangeNickname(int user_id, int friend_user_id, string nickname)
        {
            if (!Exists(user_id, friend_user_id))
            {
                return new JsonResult(BadRequest($"relation from user {user_id} to {friend_user_id} does not exist"));
            }
            User_Relationship rel = context.User_Relationship.Find(GetID(user_id, friend_user_id));

            if (!rel.Is_Friend)
            {
                return new JsonResult(BadRequest($"users {user_id} and {friend_user_id} aren't friends"));
            }
            rel.Nickname = nickname;

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }


        [HttpGet("friends-of-user{id}")]
        public IActionResult GetFriends(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.Friend_User_Id == id && x.Is_Friend).Select(x => x.User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("pending-requests-to-user{id}")]
        public IActionResult GetPendingRequestsIn(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.Friend_User_Id == id && x.Pending).Select(x => x.User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("pending-requests-from-user{id}")]
        public IActionResult GetPendingRequestsOut(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.User_Id == id && x.Pending).Select(x => x.Friend_User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("muted-users-of-user{id}")]
        public IActionResult GetMutedUsers(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.Is_Muted && x.User_Id == id).Select(x => x.Friend_User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("blocked-users-of-user{id}")]
        public IActionResult GetBlockedUsers(int id)
        {
            List<int> user_ids = context.User_Relationship.Where(x => x.Is_Blocked && x.User_Id == id).Select(x => x.Friend_User_Id).ToList();
            return Ok(context.User.Where(x => user_ids.Contains(x.Id)).ToList());
        }

        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            return Ok(context.User_Relationship);
        }

        [HttpGet("get-relation")]
        public IActionResult GetRelationship(int id1, int id2)
        {
            if (!Exists(id1, id2))
            {
                return BadRequest("this relationship does not exist");
            }
            return Ok(context.User_Relationship.Where(x => x.User_Id == id1 && x.Friend_User_Id == id2).First());
        }
    }
}
