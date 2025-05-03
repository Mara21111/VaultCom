import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { Chat } from '../../models/Chat';
import { ChatService } from '../../services/chat.service';
import { catchError, of } from 'rxjs';

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
  }

  ngOnInit(): void  {
    this.refresh();
  }


  chatName: string = "";

  public createChat(): void {
    let newChat = this.chatService.newPublicChat(this.chatName);

    this.chatService.createChat(newChat).subscribe(_ => this.refresh());
    this.chatName = '';
  }

  public deleleteChat(id: number): void {
    this.chatService.deleteChat(id).subscribe(_ => this.refresh());
  }

  private refresh(): void {
    this.chatService.getAllPublicChats().pipe(
      catchError(err => {
        console.error('Failed to load chats', err);
        return of([]);
      })
    ).subscribe(result => this.publicChats = result);
  }
}