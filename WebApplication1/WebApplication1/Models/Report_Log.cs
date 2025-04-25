using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models
{
    public class Report_Log
    {
        [Key]
        public int Id { get; set; }
        
        public int User_Id { get; set; }

        public int Reported_User_Id { get; set; }

        public string Message { get; set; }
    }
}
