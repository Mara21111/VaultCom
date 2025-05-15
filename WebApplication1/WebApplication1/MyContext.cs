using Microsoft.EntityFrameworkCore;
using WebApplication1.Models.Data;

namespace WebApplication1
{
    public class MyContext : DbContext
    {
        public DbSet<Chat> Chat { get; set; }
        public DbSet<PublicChat> PublicChat { get; set; }
        public DbSet<GroupChat> GroupChat { get; set; }
        public DbSet<PrivateChat> PrivateChat { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<MessageInfo> MessageInfo { get; set; }
        public DbSet<MessageUserReaction> MessageUserReaction { get; set; }
        public DbSet<Reaction> Reaction { get; set; }
        public DbSet<ReportLog> ReportLog { get; set; }
        public DbSet<User> User { get; set; }
        public DbSet<UserChatRelationship> UserChatRelationship { get; set; }
        public DbSet<User_Relationship> UserRelationship { get; set; }

        public MyContext(DbContextOptions<MyContext> options) : base(options)
        { }
        /*protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySQL("server=mysqlstudenti.litv.sssvt.cz;database=3b1_dekanmarek_db2;user=dekanmarek;password=123456;SslMode=none");
        }*/

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MessageInfo>().HasNoKey();
            modelBuilder.Entity<MessageUserReaction>().HasNoKey();

            modelBuilder.Entity<ReportLog>().HasKey(x => x.Id);
            modelBuilder.Entity<Message>().HasKey(x => x.Id);

            base.OnModelCreating(modelBuilder);
        }
    }
}
