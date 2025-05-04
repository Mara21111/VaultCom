import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/Chat';
import { UserChatService } from '../../services/user_chat.service';
import { Message } from '../../models/Message';
import { MessageService } from '../../services/message.service';
import { catchError } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { Report_log } from '../../models/Report_log';

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
  activeChatUsers: User[] = [];
  public_chats: boolean = false;
  pinnedMessages: boolean = false;
  showChatInfo: boolean = false;
  userChats: Chat[] = [];
  publicChats: Chat[] = [];
  activeChat: Chat = new Chat;
  allMessages: Message[] = [];
  newMessage: Message = new Message;
  searchChat: string = '';
  searchMessage: string = '';

  constructor(private userService: UserService,
    private chatService: ChatService,
    private userChatService: UserChatService,
    private messageService: MessageService,
    private reportsService: ReportsService) {
      this.newMessage.is_Edited = false;
      this.newMessage.is_Pinned = false;
      this.newMessage.is_Single_Use = false;
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => {
      this.user = result;
      this.userChatService.chatsUserIsIn(this.user.id).subscribe(chats => this.userChats = chats);
    });
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
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
    this.userChatService.usersInChat(chat.id).subscribe(result => this.activeChatUsers = result);
    this.refreshMessages();
  }

  changeChatsToPublic(){
    this.public_chats = true;
    this.activeChat = new Chat;
    this.allMessages = [];
    this.chatService.getAllPublicChats().subscribe(result => this.publicChats = result)
  }

  changeChatsToPrivate(){
    this.public_chats = false;
    this.activeChat = new Chat;
    this.allMessages = [];
    this.userChatService.chatsUserIsIn(this.user.id).subscribe(chats => this.userChats = chats);
  }

  getChats(): Chat[]{
    const chats = this.public_chats ? this.publicChats : this.userChats;

    if (!this.searchChat?.trim()) {
      return chats;
    }
  
    const query = this.searchChat.toLowerCase();
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(query)
    );
  }

  sendMessage(){
    if(this.activeChat.id == null){
      throw new Error("Chat not selected");
    }

    this.newMessage.user_Id = this.user.id;
    this.newMessage.chat_Id = this.activeChat.id;
    this.newMessage.time = new Date;
    this.messageService.createMessage(this.newMessage).pipe(
          catchError(error =>{throw error})
        ).subscribe(_ => this.refreshMessages());
    this.newMessage.content = '';
  }

  getUsername(userId: number): string {
    const user = this.activeChatUsers.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  messages(): Message[]{
    const messages = this.pinnedMessages ? this.allMessages.filter(m => m.is_Pinned === true) : this.allMessages;

    if (!this.searchMessage?.trim()) {
      return messages;
    }
  
    const query = this.searchMessage.toLowerCase();
    return messages.filter(message =>
      message.content.toLowerCase().includes(query)
    );
  }

  isUserInPublicChat(chatId: number): Boolean{
    return this.userChats.find(x => x.id == chatId) ? true : false;
  }

  addUserToPublicChat(chatId: number){
    if (!this.isUserInPublicChat(chatId)){
      let link = this.userChatService.newLink(this.user.id, chatId)
      this.userChatService.createLink(link).subscribe(response => {
        this.changeChatsToPrivate();
        this.activeChat = this.publicChats.find(x => x.id = chatId)?? new Chat;
        this.refreshMessages();
      });
    }else{
      this.userChatService.deteleLink(this.user.id, chatId).subscribe(response => {
        this.changeChatsToPrivate();
        this.allMessages = [];
      });
    }

  }

  chatInfo(){
    this.showChatInfo = !this.showChatInfo;
    console.log(this.activeChatUsers)
  }

  muteUser(user: User){

  }

  reportUser(user: User){
    let report = new Report_log;
    report.user_Id = this.user.id;
    report.reported_User_Id = user.id;
    report.message = 'Zatim takhle natvrdo'

    this.reportsService.createReport(report).subscribe();
  }
}