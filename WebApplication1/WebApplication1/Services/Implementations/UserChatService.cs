using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using Org.BouncyCastle.Asn1.X509;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Services.Implementations
{
    public class UserChatService : IUserChatService
    {
        private readonly MyContext context;

        public UserChatService(MyContext context)
        {
            this.context = context;
        }


    }
}
