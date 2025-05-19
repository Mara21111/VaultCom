using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using MySql.Data.MySqlClient;
using Org.BouncyCastle.Ocsp;
using System;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRelationshipController : MainController
    {
        private readonly IUserRelationshipService _URService;

        public UserRelationshipController(IUserRelationshipService URService)
        {
            _URService = URService;
        }

        [HttpPost("send-friend-request")]
        public Task<IActionResult> SendFriendRequest(UserRelationshipDTO dto)
            => HandleService(() => _URService.SendFriendRequestAsync(dto));

        [HttpPost("accept-friend-request")]
        public Task<IActionResult> AcceptFriendRequest(UserRelationshipDTO dto)
            => HandleService(() => _URService.AcceptFriendRequestAsync(dto));

        [HttpGet("get-incoming-friend-requests-{id}")]
        public Task<IActionResult> GetIncomingFriendRequest(int id)
            => HandleService(() => _URService.GetIncomingFriendRequestsAsync(id));

        [HttpGet("get-outcoming-friend-requests-{id}")]
        public Task<IActionResult> GetOutcomingFriendRequest(int id)
            => HandleService(() => _URService.GetOutcomingFriendRequestsAsync(id));

        [HttpGet("get-friends-{id}")]
        public Task<IActionResult> GetFriends(int id)
            => HandleService(() => _URService.GetFriendsAsync(id));

        /*private MyContext context = new MyContext();

        private User_Relationship CreateRelationship(User_Relationship_DTO help_module)
        {
            return new User_Relationship()
            {
                User_Id = help_module.sender_id,
                Friend_User_Id = help_module.reciever_id,
                Is_Blocked = false,
                Is_Muted = false,
                Is_Friend = false,
                Pending = false,
                Nickname = ""
            };
        }

        private int GetID(User_Relationship_DTO help_module)
            => context.User_Relationship.Where(x => x.User_Id == help_module.sender_id && x.Friend_User_Id == help_module.reciever_id).First().Id;

        private bool Exists(User_Relationship_DTO help_module)
        {
            return context.User_Relationship.Where(x => x.User_Id == help_module.sender_id && x.Friend_User_Id == help_module.reciever_id).Any();
        }

        private void RemoveFromDatabaseIfDefault(User_Relationship rel)
        {
            if (rel.Is_Friend || rel.Is_Muted || rel.Is_Blocked || rel.Pending)
                return;

            context.User_Relationship.Remove(rel);
            context.SaveChanges();
        }


        [HttpPost("send-friend-request")]
        public JsonResult SendRequest(User_Relationship_DTO help_module)
        {
            User_Relationship? rel;
            if (!Exists(help_module))
            {
                rel = CreateRelationship(help_module);
                rel.Pending = true;
                context.User_Relationship.Add(rel);
                context.SaveChanges();
                return new JsonResult(Ok(rel));
            }

            rel = context.User_Relationship.Find(GetID(help_module));
            User_Relationship? rel_reverse = context.User_Relationship.Find(GetID(help_module.Reverse()));

            if (rel_reverse.Is_Friend)
            {
                rel_reverse.Is_Friend = true;
                context.SaveChanges();
                return new JsonResult(Ok(rel));
            }
            if (rel.Is_Friend)
            {
                return new JsonResult(BadRequest("users are friends already"));
            }

            rel.Pending = true;
            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        [HttpPost("accept-friend-request")]
        public JsonResult AcceptRequest(User_Relationship_DTO help_module)
        {
            User_Relationship? rel;
            if (!Exists(help_module))
            {
                return new JsonResult(BadRequest($"relation from user {help_module.sender_id} to {help_module.reciever_id} does not exist"));
            }

            rel = context.User_Relationship.Find(GetID(help_module));
            if (!rel.Pending)
            {
                return new JsonResult(BadRequest($"there is no pending request from user {rel.User_Id}"));
            }

            rel.Pending = false;
            rel.Is_Friend = true;
            context.SaveChanges();

            User_Relationship? rel2 = new();
            if (!Exists(help_module.Reverse()))
            {
                rel2 = CreateRelationship(help_module.Reverse());
                rel2.Is_Friend = true;
                context.User_Relationship.Add(rel2);
            }
            else
            {
                rel2 = context.User_Relationship.Find(GetID(help_module.Reverse()));
                rel2.Is_Friend = true;
            }
            context.SaveChanges();

            var dm = new Chat()
            {
                Name = $"{context.User.Find(help_module.sender_id).Username}-{context.User.Find(help_module.reciever_id).Username}",
                Is_Public = false,
                Creator_Id = help_module.reciever_id,
                Description = "desc"
            };
            context.Chat.Add(dm);
            context.SaveChanges();

            dm = context.Chat.OrderBy(x => x.Id).Last();
            context.User_Chat.Add(new() { Chat_Id = dm.Id, User_Id = help_module.sender_id });
            context.User_Chat.Add(new() { Chat_Id = dm.Id, User_Id = help_module.reciever_id });
            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        [HttpPost("cancel-friend-request")]
        public JsonResult CancelRequest(User_Relationship_DTO help_module)
        {
            User_Relationship? rel;
            if (!Exists(help_module))
            {
                return new JsonResult(BadRequest($"relation from user {help_module.sender_id} to {help_module.reciever_id} does not exist"));
            }

            rel = context.User_Relationship.Find(GetID(help_module));
            rel.Pending = false;
            RemoveFromDatabaseIfDefault(rel);

            context.SaveChanges();
            return new JsonResult(Ok(rel));
        }

        [HttpPost("unfriend-user")]
        public JsonResult UnfriendUser(User_Relationship_DTO help_module)
        {
            User_Relationship? rel;
            if (!Exists(help_module))
            {
                return new JsonResult(BadRequest($"relation from user {help_module.sender_id} to {help_module.reciever_id} does not exist"));
            }

            rel = context.User_Relationship.Find(GetID(help_module));
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


        /*[HttpPost("toggle-{user_id}-block-{blocked_user_id}")]
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
        }*/


        /*[HttpGet("friends-of-user{id}")]
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
        public IActionResult GetRelationship(User_Relationship_DTO help_module)
        {
            if (!Exists(help_module))
            {
                return BadRequest("this relationship does not exist");
            }
            return Ok(context.User_Relationship.Find(GetID(help_module)));
        }

        [HttpGet("get-relation-by-id-{id}")]
        public IActionResult GetRelationshipByID(int id)
        {
            return Ok(context.User_Relationship.Find(id));
        }*/
    }
}
