using Microsoft.EntityFrameworkCore;
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
            if (dto.message.Length == 0)
                return new ServiceResult { Success = false, ErrorMessage = "please provide reason" };

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
            if (user is null || !user.IsAdmin)
                return new ServiceResult { Success = false, ErrorMessage = "user is not admin", ErrorCode = 403 };

            return new ServiceResult { Success = true, Data = await context.ReportLog.ToListAsync() };
        }

        public async Task<ServiceResult> UseReportAsync(UseReportDTO dto, string action)
        {
            var admin = await context.User.FindAsync(dto.userId);
            if (admin is null || !admin.IsAdmin)
                return new ServiceResult { Success = false, ErrorMessage = "user is not admin", ErrorCode = 403 };
            var report = await context.ReportLog.FindAsync(dto.reportId);
            if (report is null)
                return new ServiceResult { Success = false, ErrorMessage = "report does not exist", ErrorCode = 400 };
            var user = await context.User.FindAsync(report.ReportedUserId);
            if (user is null)
                return new ServiceResult { Success = false, ErrorMessage = "reported user does not exist", ErrorCode = 400 };

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
