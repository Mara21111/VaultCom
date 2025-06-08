using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

public class ChatHub : Hub
{
    private readonly IMessageService _messageService;

    public ChatHub(IMessageService messageService)
    {
        _messageService = messageService;
    }

    public async Task SendMessage(MessageDTO dto)
    {
        var result = await _messageService.SendMessageAsync(dto);

        if (result.Success)
        {
            await Clients.All.SendAsync("GetMessagesInChatAsync", dto.UserId, dto.ChatId);
        }
        else
        {
            Console.WriteLine($"Message failed to send: {result.ErrorMessage}");
        }
    }

    public async Task StartTyping(UserChatRelationshipDTO dto)
    {
        await Clients.Others.SendAsync("UserTypingAsync", dto);
    }

    public async Task StoppedTyping(UserChatRelationshipDTO dto)
    {
        await Clients.Others.SendAsync("UserStoppedTypingAsync", dto);
    }
}