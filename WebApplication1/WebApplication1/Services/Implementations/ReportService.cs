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
    public class ReportService : IReportService
    {
        private readonly MyContext context;

        public ReportService(MyContext context)
        {
            this.context = context;
        }

        public async Task<ServiceResult> SendReportAsync(CreateReportDTO dto)
        {
            if (!await dto.Exists(context))
                return new ServiceResult { Success = false, ErrorMessage = "user does not exists" };

            var report = new ReportLog
            {
                UserId = dto.RequestorId,
                ReportedUserId = dto.TargetId,
                Message = dto.message
            };
            context.ReportLog.Add(report);
            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = report };
        }

        public async Task<ServiceResult> ViewReportsAsync(int id)
        {
            var user = await context.User.FindAsync(id);
            if (user is null)
                return new ServiceResult { Success = false, ErrorMessage = "uer is null" };
            if (!user.IsAdmin)
                return new ServiceResult { Success = false, ErrorMessage = "permission denied", ErrorCode = 403 };

            return new ServiceResult { Success = true, Data = await context.ReportLog.ToListAsync() };
        }

        public async Task<ServiceResult> UseReportAsync(UseReportDTO dto, string action)
        {
            User? admin = await context.User.FindAsync(dto.userId);
            var report = await context.ReportLog.FindAsync(dto.reportId);
            User? user = await context.User.FindAsync(report.ReportedUserId);
            if (!admin.IsAdmin)
                return new ServiceResult { Success = false, ErrorMessage = "permission denied", ErrorCode = 403 };

            context.ReportLog.Remove(report);

            if (action == "timeout" && dto.until.HasValue)
            {
                user.TimeoutEnd = dto.until.Value;
            }
            else if (action == "ban" && dto.until.HasValue)
            {
                user.BanEnd = dto.until.Value;
            }
            else if (action != "remove")
            {
                return new ServiceResult { Success = false, ErrorMessage = "cannot perform an anciton" };
            }

            await context.SaveChangesAsync();

            return new ServiceResult { Success = true, Data = report };
        }

        public async Task<ServiceResult> GetReportCountAsync(int id)
        {
            int count = await context.ReportLog.Where(x => x.ReportedUserId == id).CountAsync();

            return new ServiceResult { Success = true, Data = count };
        }
    }
}
