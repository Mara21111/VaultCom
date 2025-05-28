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
        // Uložíš zprávu do DB přes službu
        await _messageService.SendMessageAsync(dto);

        // Pošleš zprávu všem klientům
        await Clients.All.SendAsync("GetMessagesInChatAsync", dto.UserId, dto.ChatId);
    }
}