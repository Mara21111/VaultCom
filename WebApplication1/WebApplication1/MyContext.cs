using Microsoft.EntityFrameworkCore;
using WebApplication1.Models;

namespace WebApplication1
{
    public class MyContext : DbContext
    {
        public DbSet<Chat> Chat { get; set; }

        public DbSet<Message> Message { get; set; }

        public DbSet<Message_Info> Message_Info { get; set; }

        public DbSet<Message_User_Reaction> Message_User_Reaction { get; set; }

        public DbSet<Reaction> Reaction { get; set; }

        public DbSet<Report_Log> Report_Log { get; set; }

        public DbSet<User> User { get; set; }

        public DbSet<User_Chat> User_Chat { get; set; }

        public DbSet<User_Relationship> User_Relationship { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=mysqlstudenti.litv.sssvt.cz;database=3b1_dekanmarek_db2;user=dekanmarek;password=123456;SslMode=none");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Message_Info>().HasNoKey();
            modelBuilder.Entity<Message_User_Reaction>().HasNoKey();
            modelBuilder.Entity<User_Chat>().HasNoKey();
            modelBuilder.Entity<User_Relationship>().HasNoKey();

            modelBuilder.Entity<Report_Log>().HasKey(x => x.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}
