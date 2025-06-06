using Microsoft.EntityFrameworkCore;
using WebApplication1;
using WebApplication1.Services;
using WebApplication1.Services.Implementations;
using WebApplication1.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//  REMOVE THIS LINE: builder.Services.AddScoped<MyContext>();

//  Register with proper MySQL context
builder.Services.AddDbContext<MyContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")!));

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IPublicChatService, PublicChatService>();
builder.Services.AddScoped<IGroupChatService, GroupChatService>();
builder.Services.AddScoped<IPrivateChatService, PrivateChatService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IUserChatRelationshipService, UserChatRelationshipService>();
builder.Services.AddScoped<IUserRelationshipService, UserRelationshipService>();
builder.Services.AddScoped<IMessageInfoService, MessageInfoService>();
builder.Services.AddScoped<IStatisticsService, StatisticsService>();
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<TokenService>();

builder.Services.AddSignalR();

// CORS setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.UseCors("CorsPolicy");
app.MapControllers();

app.UseRouting();

app.MapHub<ChatHub>("/chathub");

app.Run();