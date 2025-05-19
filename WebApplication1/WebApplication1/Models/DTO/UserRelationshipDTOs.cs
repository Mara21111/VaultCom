using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models.DTO
{
    public class UserRelationshipDTO : RequestDTO
    {
        public UserRelationshipDTO Reverse()
            => new() { RequestorId = TargetId, TargetId = RequestorId };
    }
}
