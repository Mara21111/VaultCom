import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';
import { PublicChatService } from '../../services/PublicChat.service';
import { UserService } from '../../services/User.service';
import {CreatePublicChatDTO, PublicChat, PublicChatGetterDTO} from '../../models/PublicChat';
import {ChatService} from '../../services/ChatService';

@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [NgFor, BaseUiComponent, FormsModule, CommonModule],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {
  @ViewChild(BaseUiComponent) baseComp!: BaseUiComponent;
  ChatName: string;
  ChatDes: string;
  Chats: PublicChatGetterDTO[];
  User: User;
  CreateChatPopup: boolean = false;
  searchValue: string = '';

  constructor(private chatService: ChatService, private userService: UserService, private publicChatService: PublicChatService) {
  }

  ngOnInit() {
    this.refreshChats();
    this.userService.getFromToken().subscribe(result => this.User = result);
    this.searchValue = this.baseComp?.searchValue;
  }

    onSearchChanged(value: string) {
    this.searchValue = value;
  }

  public getChats(): PublicChatGetterDTO[] {
    const chats = this.Chats;
      if (!this.searchValue?.trim()) {
        return chats;
      }

      const query = this.searchValue.toLowerCase();
      return chats.filter(chat =>
        chat.title.toLowerCase().includes(query)
      );
  }

  createChat(): void {
    this.CreateChatPopup = false;
    let newChat = new CreatePublicChatDTO
    newChat.CreatorId = this.User.id;
    newChat.Title = this.ChatName;
    newChat.Desc = this.ChatDes;
    this.publicChatService.createPublicChat(newChat).subscribe(_ => {this.refreshChats(); this.resetPopup();});
  }

  deleteChat(chat_id: number): void {

  }

  resetPopup(): void {
    this.ChatDes = "";
    this.ChatName = ""; 
  }

  close(): void {
    this.CreateChatPopup = false;
    this.resetPopup();
  }

  refreshChats(): void {
    this.chatService.getPublicChatsAdminView().subscribe(result => {
      this.Chats = result;
    });
  }
}