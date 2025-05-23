import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { UserService } from '../../services/User.service';
import { PublicChatService } from '../../services/PublicChat.service';
import { Chat, ChatGetterDTO } from '../../models/Chat';
import { ChatService } from '../../services/ChatService';
import { Message } from '../../models/Message';
import { MessageService} from '../../services/message.service';
import { catchError } from 'rxjs';
import { ReportsService} from '../../services/reports.service';
import { CreateReportDTO, ReportLog, UserReportDTO } from '../../models/ReportLog';
import { PublicChat } from '../../models/PublicChat';
import { UserChatRelationshipService } from '../../services/UserChatRelationship.service';
import { title } from 'node:process';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent, NgFor, FormsModule ] ,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  logedInUser: User = new User;
  activeChatUsers: User[] = [];
  showPublicChats: boolean = false;
  pinnedMessages: boolean = false;
  showChatInfo: boolean = false;
  reportPopup: boolean = false;
  userChats: ChatGetterDTO[] = [];
  activeChat: ChatGetterDTO = new ChatGetterDTO();
  allMessages: Message[] = [];
  newMessage: Message = new Message;
  searchChat: string = '';
  searchMessage: string = '';
  reportReason: string = '';
  reportUserId: number = 0;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private publicChatService: PublicChatService,
    private userChatRelationshipService: UserChatRelationshipService,
    private messageService: MessageService,
    private reportsService: ReportsService) {
      this.newMessage.isEdited = false;
      this.newMessage.isPinned = false;
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => {
      this.logedInUser = result;
      this.chatService.getChatsUserIsIn(this.logedInUser.id).subscribe(chats => this.userChats = chats);
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
    this.messageService.getMessagesInChat(this.logedInUser.id, this.activeChat.id).subscribe(result => this.allMessages = result);
  }

  changeActiveChat(chat: ChatGetterDTO){
    this.activeChat = chat;
    //Zatím není v api
    //this.chatService.UsersInChat(chat.id).subscribe(result => this.activeChatUsers = result);
    this.refreshMessages();
  }

  changeChatsToPublic(){
    this.showPublicChats = true;
    this.setChats();
    this.publicChatService.getAllPublicChats().subscribe(result => this.userChats = result)
  }

  changeChatsToPrivate(){
    this.showPublicChats = false;
    this.setChats();
    this.chatService.getChatsUserIsIn(this.logedInUser.id).subscribe(chats => this.userChats = chats);
  }

  setChats(){
    this.searchChat = "";
    this.showChatInfo = false;
    this.activeChat = new ChatGetterDTO();
    this.allMessages = [];
  }

  sendMessage(){
    if(this.activeChat.id == null){
      throw new Error("Chat not selected");
    }

    this.newMessage.userId = this.logedInUser.id;
    this.newMessage.chatId = this.activeChat.id;
    this.messageService.createMessage(this.newMessage).pipe(
          catchError(error =>{throw error})
        ).subscribe(_ => this.refreshMessages());
    this.newMessage.content = '';
  }

  getUsername(userId: number): string {
    const user = this.activeChatUsers.find(u => u.id === userId);
    // zatím místo username je id
    return user ? userId.toString() : 'Unknown';
  }

  chats(): ChatGetterDTO[]{
    const chats = this.userChats;

    if (!this.searchChat?.trim()) {
      return chats;
    }

    const query = this.searchChat.toLowerCase();
    return chats.filter(chat =>
      chat.title.toLowerCase().includes(query)
    );
  }

  messages(): Message[]{
    const messages = this.pinnedMessages ? this.allMessages.filter(m => m.isPinned === true) : this.allMessages;

    if (!this.searchMessage?.trim()) {
      return messages;
    }

    const query = this.searchMessage.toLowerCase();
    return messages.filter(message =>
      message.content.toLowerCase().includes(query)
    );
  }

  isUserInPublicChat(chatId: number): Boolean{
    return !!this.userChats.find(chat => chat.id == chatId);
  }

  addUserToPublicChat(chatId: number){
    if (!this.isUserInPublicChat(chatId)){
      let link = this.chatService.newLink(this.logedInUser.id, chatId)
      this.chatService.CreateLink(link).subscribe(response => {
        this.changeChatsToPrivate();
        //this.activeChat = this.publicChats.find(x => x.Id = chatId)?? new Chat;
        this.refreshMessages();
      });
    }else{
      this.chatService.DeleteLink(this.logedInUser.id, chatId).subscribe(response => {
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
    let createReportDTO = new CreateReportDTO;
    createReportDTO.requestorId = this.logedInUser.id;
    createReportDTO.targetId = this.reportUserId;
    createReportDTO.message = this.reportReason;
    this.reportPopup = false;

    this.reportsService.sendReport(createReportDTO).subscribe();
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
