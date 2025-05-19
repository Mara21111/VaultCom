import { Component, inject, ViewChild } from '@angular/core';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';
import { PublicChatService } from '../../services/PublicChat.service';
import { UserService } from '../../services/User.service';
import { PublicChat } from '../../models/PublicChat';

@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [NgFor, BaseUiComponent, FormsModule],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {
  ChatName: string;
  Chats: PublicChat[];

  constructor(private chatService: PublicChatService, private userService: UserService) {

  }

  ngOnInit() {
    this.chatService.GetAllPublicChats().subscribe(result => {
      this.Chats = result;
    });
  }

  CreateChat(): void {

  }

  DeleteChat(chat_id: number): void {

  }
}
