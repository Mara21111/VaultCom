using Microsoft.AspNetCore.Authentication;
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
    public class AuthenticationService : Interfaces.IAuthenticationService
    {
        private readonly MyContext context;
        private readonly MyContext _context;
        private readonly TokenService _tokenService;

        public AuthenticationService(MyContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public async Task<AuthResult> LoginAsync(LoginDTO loginDto)
        {
            var user = _context.User.FirstOrDefault(x => x.Username == loginDto.Username);

            var hasher = new PasswordHasher<User>();
            var hsh = hasher.VerifyHashedPassword(user, user.Password, loginDto.Password);

            if (user != null && hsh == PasswordVerificationResult.Success)
            {
                var token = _tokenService.Create(user);

                return new AuthResult
                {
                    Success = true,
                    Token = token
                };
            }

            return new AuthResult
            {
                Success = false,
                Message = "Invalid username or password"
            };
        }

    }
}
