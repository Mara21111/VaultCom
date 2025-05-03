import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/Chat';
import { UserChatService } from '../../services/user_chat.service';
import { Message } from '../../models/Message';
import { MessageService } from '../../services/message.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent, NgFor, FormsModule ] ,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  user: User = new User;
  allUser: User[] = [];
  public_chats: boolean = false;
  pinnedMessages: boolean = false;
  chats: Chat[] = [];
  activeChat: Chat = new Chat;
  allMessages: Message[] = [];
  newMessage: Message = new Message;

  constructor(private userService: UserService,
    private chatService: ChatService,
    private userChatService: UserChatService,
    private messageService: MessageService) {
      this.newMessage.is_Edited = false;
      this.newMessage.is_Pinned = false;
      this.newMessage.is_Single_Use = false;
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => {
      this.user = result;
      this.userChatService.chatsUserIsIn(this.user.id).subscribe(chats => this.chats = chats);
    });

    this.userService.getAll().subscribe(users => this.allUser = users);
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom(); // zavolá se po každém vykreslení
  }
  
  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  refreshMessages(){
    this.messageService.getMessagesInChat(this.activeChat.id).subscribe(result => this.allMessages = result);
  }

  changeActiveChat(chat: Chat){
    this.activeChat = chat;
    this.refreshMessages();
  }

  changeChatsToPublic(){
    this.public_chats = true;
    this.chatService.getAllPublicChats().subscribe(result => this.chats = result)
  }

  changeChatsToPrivate(){
    this.public_chats = false;
    this.userChatService.chatsUserIsIn(this.user.id).subscribe(chats => this.chats = chats);
  }

  sendMessage(){
    if(this.activeChat.id == null){
      throw new Error("Chat not selected");
    }

    this.newMessage.user_Id = this.user.id;
    this.newMessage.chat_Id = this.activeChat.id;
    this.newMessage.time = new Date();
    console.log(this.newMessage);
    this.messageService.createMessage(this.newMessage).pipe(
          catchError(error =>{throw error})
        ).subscribe(_ => this.refreshMessages());
    this.newMessage.content = '';
  }

  getUsername(userId: number): string {
    const user = this.allUser.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  messages(): Message[]{

    if (this.pinnedMessages){
      return this.allMessages.filter(m => m.is_Pinned === true);
    }
    else{
      return this.allMessages;
    }
  }
}