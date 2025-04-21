using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1
{
    public class MyContext : DbContext
    {
        public DbSet<Chat> Chats { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<Message_Info> Messages_Info { get; set; }

        public DbSet<Message_User_Reaction> Messages_User_Reaction { get; set; }

        public DbSet<Reaction> Reactions { get; set; }

        public DbSet<Report_Log> Report_Log { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<User_Chat> Users_Chat { get; set; }

        public DbSet<User_Relationship> Users_Relationship { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=mysqlstudenti.litv.sssvt.cz;database=3b1_dekanmarek_db2;user=dekanmarek;password=123456;SslMode=none");
        }
    }
}
