import { Component, inject } from '@angular/core';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { Chat } from '../../models/Chat';
import { User } from '../../models/User';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
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
  user: User = new User;
  chatName: string = "";

  constructor(private chatService: ChatService, private userService: UserService) {
  }

  ngOnInit(): void  {
    this.refresh();
    this.userService.getFromToken().subscribe(result => {
      this.user = result; console.log(this.user.id)
    });
  }

  public createChat(): void {
    let newChat = this.chatService.newPublicChat(this.chatName);

    this.chatService.createChat(newChat).subscribe(_ => this.refresh());
    this.chatName = '';
  }

  public deleleteChat(chat_id: number): void {
    this.chatService.deleteChat(chat_id, this.user.id).subscribe(_ => this.refresh());
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