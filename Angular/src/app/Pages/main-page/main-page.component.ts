import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { PublicChatService } from '../../services/public_chat.service';
import { Chat } from '../../models/Chat';
import { UserChatService } from '../../services/chat.service';
import { Message } from '../../models/Message';
import { MessageService } from '../../services/message.service';
import { catchError } from 'rxjs';
import { ReportsService } from '../../services/reports.service';
import { ReportLog } from '../../models/ReportLog';
import {PublicChat} from '../../models/PublicChat';

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
  reportPopup: boolean = false;
  userChats: Chat[] = [];
  publicChats: PublicChat[] = [];
  activeChat: Chat = new Chat;
  allMessages: Message[] = [];
  newMessage: Message = new Message;
  searchChat: string = '';
  searchMessage: string = '';
  reportReason: string = '';
  reportUserId: number = 0;

  constructor(private userService: UserService,
    private chatService: PublicChatService,
    private userChatService: UserChatService,
    private messageService: MessageService,
    private reportsService: ReportsService) {
      this.newMessage.IsEdited = false;
      this.newMessage.IsPinned = false;
  }

  ngOnInit() {
    this.userService.GetFromToken().subscribe(result => {
      this.user = result;
      console.log(this.user);
      console.log(this.user.id);
      this.userChatService.ChatsUserIsIn(this.user.id).subscribe(chats => this.userChats = chats);
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
    this.messageService.getMessagesInChat(this.activeChat.Id).subscribe(result => this.allMessages = result);
  }

  changeActiveChat(chat: Chat){
    this.activeChat = chat;
    this.userChatService.UsersInChat(chat.Id).subscribe(result => this.activeChatUsers = result);
    this.refreshMessages();
  }

  changeChatsToPublic(){
    this.public_chats = true;
    this.setChats();
    this.chatService.GetAllPublicChats().subscribe(result => this.publicChats = result)
  }

  changeChatsToPrivate(){
    this.public_chats = false;
    this.setChats();
    this.userChatService.ChatsUserIsIn(this.user.id).subscribe(chats => this.userChats = chats);
  }

  setChats(){
    this.showChatInfo = false;
    this.activeChat = new Chat;
    this.allMessages = [];
  }

  getChats(): Chat[]{
    /*const chats = this.public_chats ? this.publicChats : this.userChats;


    if (!this.searchChat?.trim()) {
      return chats;
    }

    const query = this.searchChat.toLowerCase();
    return chats.filter(chat =>
      chat..toLowerCase().includes(query)
    );*/

    return this.userChats;
  }

  sendMessage(){
    if(this.activeChat.Id == null){
      throw new Error("Chat not selected");
    }

    this.newMessage.UserId = this.user.id;
    this.newMessage.ChatId = this.activeChat.Id;
    this.messageService.createMessage(this.newMessage).pipe(
          catchError(error =>{throw error})
        ).subscribe(_ => this.refreshMessages());
    this.newMessage.Content = '';
  }

  getUsername(userId: number): string {
    const user = this.activeChatUsers.find(u => u.id === userId);
    return user ? user.Username : 'Unknown';
  }

  messages(): Message[]{
    const messages = this.pinnedMessages ? this.allMessages.filter(m => m.IsPinned === true) : this.allMessages;

    if (!this.searchMessage?.trim()) {
      return messages;
    }

    const query = this.searchMessage.toLowerCase();
    return messages.filter(message =>
      message.Content.toLowerCase().includes(query)
    );
  }

  isUserInPublicChat(chatId: number): Boolean{
    return !!this.userChats.find(x => x.Id == chatId);
  }

  addUserToPublicChat(chatId: number){
    if (!this.isUserInPublicChat(chatId)){
      let link = this.userChatService.newLink(this.user.id, chatId)
      this.userChatService.CreateLink(link).subscribe(response => {
        this.changeChatsToPrivate();
        //this.activeChat = this.publicChats.find(x => x.Id = chatId)?? new Chat;
        this.refreshMessages();
      });
    }else{
      this.userChatService.DeleteLink(this.user.id, chatId).subscribe(response => {
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

  reportUser(){
    let report = new ReportLog;
    report.UserId = this.user.id;
    report.ReportedUserId = this.reportUserId;
    report.Message = this.reportReason;
    this.reportPopup = false;

    this.reportsService.CreateReport(report).subscribe();
  }

  showReportPopup(reportUserId: number){
    this.reportPopup = true;
    this.reportUserId = reportUserId;
  }

  cancelReport(){
    this.reportPopup = false;
    this.reportReason = '';
    this.reportUserId = 0;
  }
}
