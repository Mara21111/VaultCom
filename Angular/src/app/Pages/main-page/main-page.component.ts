import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';
import { PublicUserDataDTO, User, UserPanelInfo } from '../../models/User';
import { UserService } from '../../services/User.service';
import { PublicChatService } from '../../services/PublicChat.service';
import { ChatGetterDTO, ChatPanelInfo } from '../../models/Chat';
import { ChatService } from '../../services/ChatService';
import { Message } from '../../models/Message';
import { MessageService} from '../../services/message.service';
import { catchError } from 'rxjs';
import { ReportsService} from '../../services/reports.service';
import { CreateReportDTO } from '../../models/ReportLog';
import { UserChatRelationshipService } from '../../services/UserChatRelationship.service';
import { UserChatRelationshipDTO } from '../../models/UserChatRelationship';
import { CreateGroupChatDTO, EditGroupChatDTO } from '../../models/GroupChat';
import { GroupChatService } from '../../services/GroupChat.service';
import { ChatInfoSidePanelComponent } from "../../Components/chat-info-side-panel/chat-info-side-panel.component";
import { UserInfoSidePanelComponent } from "../../Components/user-info-side-panel/user-info-side-panel.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent, NgFor, FormsModule, ChatInfoSidePanelComponent, UserInfoSidePanelComponent] ,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  logedInUser: User = new User;
  activeChatUsers: PublicUserDataDTO[] = [];
  selectedUser: UserPanelInfo = new UserPanelInfo();
  showPublicChats: boolean = false;
  pinnedMessages: boolean = false;
  editingMessage: boolean = false;
  showChatInfo: boolean = false;
  showUserInfo: boolean = false;
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
      this.chatService.getPrivateChatsUserIsIn(this.logedInUser.id).subscribe(resutl => this.privateChats = resutl);
    });

    this.chatService.getAllPublicChats().subscribe(result => this.publicChats = result);
    this.messageService.startSignalConnection()
      .then(() => {
        this.messageService.onNewMessage((userId, chatId) => {
          this.refreshMessages();
      });
    })
    .catch(err => console.error('SignalR připojení selhalo:', err));
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
    this.messageService.getMessagesInChat(this.logedInUser.id, this.activeChat.id).subscribe(result => {
      this.allMessages = result;
      this.loadingMessages = false;
      setTimeout(() => this.scrollToBottom(), 1);
      this.messageOptionId = 0;
    });
  }

  changeActiveChat(chat: ChatGetterDTO){
    if (this.creatingGroup) {
      return;
    }
    this.messageService.startSignalConnection();
    this.activeChat = chat;
    this.userChatRelationshipService.getUsersInChat(this.activeChat.id).subscribe(resutl => this.activeChatUsers = resutl)
    this.loadingMessages = true;
    this.refreshMessages();
    this.newMessage = new Message();
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
    this.newMessage = new Message();
  }

  async sendMessage(){
    if(this.activeChat.id == null){
      throw new Error("Chat not selected");
    }
    if (!this.newMessage.content) {
      return;
    }

    if (this.editingMessage)
    {
      this.messageService.editMessage(this.logedInUser.id, this.newMessage.id, this.newMessage.content).subscribe(_ => {this.newMessage.content = ''; this.refreshMessages()});
      this.editingMessage = false;
    } else {
      this.newMessage.userId = this.logedInUser.id;
      this.newMessage.chatId = this.activeChat.id;
      /*this.messageService.createMessage(this.newMessage).pipe(
            catchError(error =>{throw error})
          ).subscribe(_ => this.refreshMessages());
      this.newMessage.content = '';*/
      await this.messageService.sendMessageSignalR(this.newMessage);
      this.refreshMessages();
      this.newMessage.content = '';
    }
  }

  deleteMessage(messageId: number) {
    this.messageService.deleteMessage(this.logedInUser.id, messageId).subscribe(_ => this.refreshMessages());
  }

  editMessage(messageId: number) {
    let message = this.allMessages.find(m => m.id === messageId)!;
    this.editingMessage = true;
    this.newMessage = message;
    this.messageOptionId = 0;
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

  showReportPopup(username: string){
    let user = this.activeChatUsers.find(u => u.username === username);

    if (user === null) {
      return;
    }

    this.showChatInfo = false;
    this.showUserInfo = false;
    this.reportPopup = true;
    this.reportUserId = user?.id ?? 0;
  }

  cancelReport(){
    this.reportPopup = false;
    this.reportReason = '';
    this.reportUserId = 0;
  }

  transformActiveChat(): ChatPanelInfo {
    let chat = new ChatPanelInfo();
    chat.id = this.activeChat.id;
    chat.title = this.activeChat.title;
    chat.users = this.activeChatUsers;

    return chat;
  }

  deleteChat(chatId: number) {
    console.log(chatId);
    this.groupChatService.deleteGroupChat(this.logedInUser.id, chatId).subscribe(_ => this.changeChatsToPrivate());
  }

  removeUser(username: string): void {
    let user = this.activeChatUsers.find(u => u.username === username);

    if (user === null) {
      return;
    }

    this.userChatRelationshipService.leavePublicChat(this.activeChat.id, user!.id).subscribe();
  }

  editChat(editedChat: ChatPanelInfo) {
    let newChat = new EditGroupChatDTO();
    newChat.chatId = editedChat.id;
    newChat.title = editedChat.title;
    newChat.userId = this.logedInUser.id;
    this.groupChatService.editGroupChat(newChat).subscribe(_ => {this.activeChat.title = newChat.title; this.showChatInfo = false});
  }

  closeUserInfo() {
    this.showUserInfo = false;
  }

  getUser(username: string): UserPanelInfo {
    let user = this.activeChatUsers.find(u => u.username == username);
    let newUser = new UserPanelInfo();
    newUser.username = user?.username ?? 'Not found';
    newUser.email = user?.email ?? 'Not found';
    newUser.bio = user?.bio ?? 'Not found';
    return newUser;
  }

  switchPanel(username: string) {
    this.selectedUser = this.getUser(username);
    this.showUserInfo = true;
  }
}
