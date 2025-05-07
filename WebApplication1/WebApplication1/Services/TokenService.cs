using JWT.Algorithms;
using JWT.Builder;
using WebApplication1.Models.Data;

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
                 .AddClaim("exp", DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds())
                 .AddClaim("id", user.Id)
                 .AddClaim("username", user.Username)
                 .Encode();
        }

        public bool Verify(string header)
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
        }
    }
}
