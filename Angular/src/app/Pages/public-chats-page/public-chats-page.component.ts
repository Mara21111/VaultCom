import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { Chat, CreateChatDTO } from '../../models/Chat';
import { User } from '../../models/User';
import { PublicChatService } from '../../services/PublicChat.service';
import { UserService } from '../../services/User.service';
import { CreatePublicChatDTO, PublicChat } from '../../models/PublicChat';

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
  Chats: PublicChat[];
  User: User;
  CreateChatPopup: boolean = false;
  searchValue: string = '';

  constructor(private chatService: PublicChatService, private userService: UserService) {

  }

  ngOnInit(): void {
    this.RefreshChats();
    this.userService.getFromToken().subscribe(result => this.User = result);
    this.searchValue = this.baseComp?.searchValue;
  }

  public GetChats(): PublicChat[] {
    const chats = this.Chats;
      if (!this.searchValue?.trim()) {
        return chats;
      }

      const query = this.searchValue.toLowerCase();
      return chats.filter(chat =>
        chat.title.toLowerCase().includes(query)
      );
  }

  onSearchChanged(value: string) {
    this.searchValue = value;
  }

  CreateChat(): void {
    this.CreateChatPopup = false;
    let newChat = new CreatePublicChatDTO
    newChat.CreatorId = this.User.id;
    newChat.Title = this.ChatName;
    newChat.Desc = this.ChatDes;
    this.chatService.CreatePublicChat(newChat).subscribe(_ => {this.RefreshChats(); this.ResetPopup();});
  }

  DeleteChat(chat_id: number): void {

  }

  ResetPopup(): void {
    this.ChatDes = "";
    this.ChatName = ""; 
  }

  Close(): void {
    this.CreateChatPopup = false;
    this.ResetPopup();
  }

  RefreshChats(): void {
    this.chatService.GetAllPublicChats().subscribe(result => {
      this.Chats = result;
    });
  }
}
