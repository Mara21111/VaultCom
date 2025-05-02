import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { DataService } from '../../services/data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/Chat';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent, NgFor, FormsModule ] ,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  
  data = inject(DataService)
  public_chats: boolean = false;

  user: User = new User;
  chats: Chat[] = [];
  message: string = '';

  constructor(private userService: UserService, private chatService: ChatService) {
    this.chats = this.data.chats;
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => this.user = result);
  }

  changeChatsToPublic(){
    this.public_chats = true;
    this.chatService.getAllPublicChats().subscribe(result => this.chats = result)
  }

  changeChatsToPrivate(){
    this.public_chats = false;
    this.chats = this.data.chats;
  }

  sendMessage(form: NgForm){
    console.log(this.message)
    this.message = '';
  }
}