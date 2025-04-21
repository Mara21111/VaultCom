using JWT.Algorithms;
using JWT.Builder;
using WebApplication1.Models;

namespace WebApplication1.Services
{
    public class TokenService
    {
        const string Password = "silneheslo";

        public string Create(User user)
        {
            return JwtBuilder.Create()
                 .WithAlgorithm(new HMACSHA256Algorithm())
                 .WithSecret(Password)
                 .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(0.5).ToUnixTimeSeconds())
                 .AddClaim("user", user.UserName)
                 .Encode();
        }
    }
}
