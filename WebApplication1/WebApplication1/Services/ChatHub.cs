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
        await _messageService.SendMessageAsync(dto);

        await Clients.All.SendAsync("GetMessagesInChatAsync", dto.UserId, dto.ChatId);
    }

    public async Task StartTyping(UserChatRelationshipDTO dto)
    {
        await Clients.Others.SendAsync("UserTypingAsync", dto.UserId, dto.ChatId);
    }

    public async Task StoppedTyping(UserChatRelationshipDTO dto)
    {
        await Clients.Others.SendAsync("UserStoppedTypingAsync", dto.UserId, dto.ChatId);
    }
}