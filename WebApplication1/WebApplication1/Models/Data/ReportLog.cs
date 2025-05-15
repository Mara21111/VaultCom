using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models.Data
{
    public class ReportLog
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public int ReportedUserId { get; set; }

        public string Message { get; set; }
    }
}
