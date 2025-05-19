using JWT.Algorithms;
using JWT.Builder;
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

        public async Task<AuthResult> LoginAsync(LoginDTO dto)
        {
            if (dto.Username is null || dto.Password is null)
            {
                return new AuthResult { Success = false, Message = "credentials are null" };
            }

            var user = await _context.User.Where(x => x.Username == dto.Username).FirstOrDefaultAsync();

            if (user is null)
            {
                return new AuthResult { Success = false, Message = "invalid username or password" };
            }

            var hasher = new PasswordHasher<User>();
            var hsh = hasher.VerifyHashedPassword(user, user.Password, dto.Password);

            if (hsh == PasswordVerificationResult.Success)
            {
                var token = _tokenService.Create(user);

                return new AuthResult
                {
                    Success = true,
                    Token = token
                };
            }

            return new AuthResult { Success = false, Message = "invalid username or password" };
        }

    }
    public class TokenService
    {
        const string Password = "silneheslo";

        public string Create(User user)
        {
            return JwtBuilder.Create()
                 .WithAlgorithm(new HMACSHA256Algorithm())
                 .WithSecret(Password)
                 .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds())
                 .AddClaim("id", user.Id)
                 .AddClaim("username", user.Username)
                 .Encode();
        }

        /*public bool Verify(string header)
        {
            try
            {
                if (header == null)
                {
                    return false;
                }

                string[] parts = header.Split(' ');

                if (parts.Length != 2)
                {
                    return false;
                }

                var payload = JwtBuilder.Create()
                            .WithAlgorithm(new HMACSHA256Algorithm())
                            .WithSecret(Password)
                            .MustVerifySignature()
                            .Decode<IDictionary<string, object>>(parts[1]);

                return true;
            }
            catch
            {
                return false;
            }
        }*/
    }
}
