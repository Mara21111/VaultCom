﻿namespace WebApplication1.Models.Data
{
    public class PrivateChat
    {
        public int Id { get; set; }
        public int UserAId { get; set; }
        public int UserBId { get; set; }

        public int GetOtherUser(int userId)
            => userId == UserAId ? UserBId : UserAId;
        public bool UserInChat(int userId)
            => userId == UserAId || userId == UserBId;
        public bool UsersInChat(int userId1, int userId2)
            => (userId1 == UserAId && userId2 == UserBId)
            || (userId2 == UserAId && userId1 == UserBId);
    }
}