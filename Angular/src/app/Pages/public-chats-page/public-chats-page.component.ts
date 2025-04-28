import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { Chat } from '../../models/Chat';
import { ChatService } from '../../services/chat.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [NgFor, BaseUiComponent, FormsModule],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {

  publicChats: Chat[] = [];

  constructor(private chatService: ChatService) {
    this.chatService.getAllPublicChats().subscribe(result => this.publicChats = result);
  }

  chatName: string = "";

  createChat() {
    let newChat = this.chatService.newPublicChat(this.chatName);

    this.chatService.createChat(newChat).pipe(
          catchError(error =>{throw error})
        ).subscribe(response => console.log(response));
    this.chatName = '';
  }

  deleleteChat(id: number) {
    this.chatService.deleteChat(id).pipe(
      catchError(error =>{throw error})
    ).subscribe(response => console.log(response));
  }
}