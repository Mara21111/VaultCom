﻿using System;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Models.Data;
using WebApplication1.Models.DTO;
using WebApplication1.Services.Interfaces;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PublicChatController : MainController
    {
        private readonly IPublicChatService _chatService;

        public PublicChatController(IPublicChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("create-public-chat")]
        public Task<IActionResult> CreatePublicChat([FromBody] CreatePublicChatDTO dto)
            => HandleService(() => _chatService.CreatePublicChatAsync(dto));

        [HttpPut("edit-public-chat")]
        public Task<IActionResult> EditPublicChat([FromBody] PublicChatEditDTO dto)
            => HandleService(() => _chatService.EditPublicChatAsync(dto));

        [HttpDelete("delete-public-chat-{userId}-{chatId}")]
        public Task<IActionResult> RemovePublicChat(int userId, int chatId)
            => HandleService(() => _chatService.DeletePublicChatAsync(userId, chatId));

    }
}