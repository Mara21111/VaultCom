import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { PublicUserDataDTO, User } from '../../models/User';
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
import { UserChatRelationshipDTO } from '../../models/UserChatRelationship';
import { BlobOptions } from 'node:buffer';
import { CreateGroupChatDTO } from '../../models/GroupChat';
import { GroupChatService } from '../../services/GroupChat.service';

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
  activeChatUsers: PublicUserDataDTO[] = [];
  showPublicChats: boolean = false;
  pinnedMessages: boolean = false;
  showChatInfo: boolean = false;
  reportPopup: boolean = false;
  loadingChats: boolean = true;
  loadingMessages: boolean = false;
  creatingGroup: boolean = false;
  shake: boolean = false;
  chats: ChatGetterDTO[] = [];
  publicChats: ChatGetterDTO[] = [];
  privateChats: ChatGetterDTO[] = [];
  activeChat: ChatGetterDTO = new ChatGetterDTO();
  allMessages: Message[] = [];
  newGroupIds: number[] = [];
  newMessage: Message = new Message;
  searchChat: string = '';
  searchMessage: string = '';
  reportReason: string = '';
  newGroupName: string = '';
  reportUserId: number = 0;
  messageOptionId: number = 0;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private publicChatService: PublicChatService,
    private groupChatService: GroupChatService,
    private userChatRelationshipService: UserChatRelationshipService,
    private messageService: MessageService,
    private reportsService: ReportsService) {
      this.newMessage.isEdited = false;
      this.newMessage.isPinned = false;
  }

  ngOnInit() {
    this.userService.getFromToken().subscribe(result => {
      this.logedInUser = result;
      this.chatService.getChatsUserIsIn(this.logedInUser.id).subscribe(chats => {
        this.loadingChats = false;
        this.chats = chats;
      });
    });
    this.chatService.getAllPublicChats().subscribe(result => this.publicChats = result);
    this.chatService.getPrivateChatsUserIsIn(this.logedInUser.id).subscribe(resutl => this.privateChats = resutl);
  }

  ngAfterViewInit() {
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
    this.loadingMessages = true;
    this.messageService.getMessagesInChat(this.logedInUser.id, this.activeChat.id).subscribe(result => {
      this.allMessages = result;
      this.loadingMessages = false;
      setTimeout(() => this.scrollToBottom(), 1);
    });
  }

  changeActiveChat(chat: ChatGetterDTO){
    if (this.creatingGroup) {
      return;
    }
    this.activeChat = chat;
    this.userChatRelationshipService.getUsersInChat(this.activeChat.id).subscribe(resutl => this.activeChatUsers = resutl)
    this.refreshMessages();
  }

  changeChatsToPublic(){
    this.showPublicChats = true;
    this.setChats();
    this.publicChatService.getAllPublicChats().subscribe(result => {
      this.publicChats = result;
      this.loadingChats = false;
    });
  }

  changeChatsToPrivate(){
    this.showPublicChats = false;
    this.setChats();
    this.chatService.getChatsUserIsIn(this.logedInUser.id).subscribe(chats => {
      this.chats = chats;
      this.loadingChats = false;
    });
  }

  toggleChatMode() {
    this.showPublicChats = !this.showPublicChats;
    this.showPublicChats ? this.changeChatsToPublic() : this.changeChatsToPrivate();
  }

  createGroupSetup() {
    this.creatingGroup = !this.creatingGroup;
    this.setChats();
    this.newGroupIds = [];
    this.newGroupName = "";
    this.chatService.getPrivateChatsUserIsIn(this.logedInUser.id).subscribe(resutl => {this.privateChats = resutl; this.loadingChats = false});
    this.activeChat = new ChatGetterDTO();
  }

  addChatToGroup(chatId: number) {
    if (this.chatInNewGroup(chatId)) {
      this.newGroupIds = this.newGroupIds.filter(id => id !== chatId);
    } else {
      this.newGroupIds.push(chatId);
    }
  }

  createGroup() {
    if (!this.newGroupName.trim()) {
      this.shake = true;
      setTimeout(() => this.shake = false, 500);
      return;
    }
    if (this.newGroupIds.length < 1) {
      return;
    }

    let newGroupChat = new CreateGroupChatDTO();
    newGroupChat.creatorId = this.logedInUser.id;
    newGroupChat.title = this.newGroupName;
    newGroupChat.chatIds = this.newGroupIds;

    this.groupChatService.createGroupChat(newGroupChat).subscribe(_ => {this.changeChatsToPrivate(); this.creatingGroup = false});
  }

  chatInNewGroup(chatId: number): boolean {
    return !!this.newGroupIds.find(x => x === chatId);
  }

  setChats(){
    this.loadingChats = true;
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

  deleteMessage(messageId: number) {
    this.messageService.deleteMessage(this.logedInUser.id, messageId).subscribe(_ => this.refreshMessages());
  }

  editMessage(messageId: number) {

  }

  pinMessage(messageId: number) {
    this.messageService.pinMessage(this.logedInUser.id, messageId).subscribe(_ => this.refreshMessages());
  }

  showMessageOptions(messageId: number) {
    if (this.messageOptionId === messageId) {
      this.messageOptionId = 0;
    } else {
      this.messageOptionId = messageId;
    }
  }

  getUsername(userId: number): string {
    const user = this.activeChatUsers.find(u => u.id === userId);
    return user ? user.username.toString() : 'Unknown';
  }

  userHasAvatar(userId: number): boolean {
  const user = this.activeChatUsers.find(u => u.id === userId);
  return !!(user && user.profilePicture);
}

  getProfilePicture(userId: number): string {
      const user = this.activeChatUsers.find(u => u.id === userId);
  return user ? user.profilePicture : '';
  }

  getChats(): ChatGetterDTO[]{
    let chats = this.creatingGroup ? this.privateChats : this.chats;
    chats = this.showPublicChats ? this.publicChats : chats;
    if (!this.searchChat?.trim()) {
      return chats;
    }

    const query = this.searchChat.toLowerCase();
    return chats.filter(chat =>
      chat.title.toLowerCase().includes(query)
    );
  }

  getMessages(): Message[]{
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
    return !!this.chats.find(chat => chat.id == chatId);
  }

  addUserToPublicChat(chatId: number){
    if (!this.isUserInPublicChat(chatId)){
      let link = new UserChatRelationshipDTO();
      link.chatId = chatId;
      link.userId = this.logedInUser.id;
      this.userChatRelationshipService.joinPublicChat(link).subscribe(response => {
        this.changeChatsToPrivate();
        this.activeChat = this.publicChats.find(x => x.id = chatId)?? new ChatGetterDTO();
        this.refreshMessages();
      });
    }else{
      this.userChatRelationshipService.leavePublicChat(chatId, this.logedInUser.id).subscribe(response => {
        this.changeChatsToPrivate();
        this.allMessages = [];
      });
    }
  }

  chatInfo(){
    this.showChatInfo = !this.showChatInfo;
    console.log(this.activeChatUsers)
  }

  muteUser(userId: number){

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
