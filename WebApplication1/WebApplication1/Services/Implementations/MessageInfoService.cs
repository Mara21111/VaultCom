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
    public class MessageInfoService : IMessageInfoService
    {
        private readonly MyContext context;

        public MessageInfoService(MyContext context)
        {
            this.context = context;
        }

        public async Task<ServiceResult> ViewMessageAsync(MessageInfoDTO dto)
        {
            var existingInfo = await context.MessageInfo.Where(x => x.ChatId == dto.ChatId && x.UserId == dto.UserId).ToListAsync();
            if (existingInfo.Any())
            {
                context.MessageInfo.RemoveRange(existingInfo);
            }

            MessageInfo info = new MessageInfo
            {
                MessageId = dto.MessageId,
                UserId = dto.UserId,
                ChatId = dto.ChatId,
                Seen = true
            };

            context.MessageInfo.Add(info);
            await context.SaveChangesAsync();
            return new ServiceResult { Success = true, Data = info };
        }
    }
}
