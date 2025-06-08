//Angular
import { CommonModule, NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggle, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

//models
import {PublicUserDataDTO, User, UserGetterDTO, UserPanelInfo} from '../../models/User';
import { ChatGetterDTO, ChatPanelInfo } from '../../models/Chat';
import { Message } from '../../models/Message';
import { CreateReportDTO } from '../../models/ReportLog';
import { UserChatRelationshipDTO } from '../../models/UserChatRelationship';
import { CreateGroupChatDTO, EditGroupChatDTO } from '../../models/GroupChat';

//services
import { ChatService } from '../../services/ChatService';
import { MessageService} from '../../services/message.service';
import { UserService } from '../../services/User.service';
import { PublicChatService } from '../../services/PublicChat.service';
import { ReportsService} from '../../services/reports.service';
import { UserChatRelationshipService } from '../../services/UserChatRelationship.service';
import { GroupChatService } from '../../services/GroupChat.service';

//components
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { ChatInfoSidePanelComponent } from "../../Components/chat-info-side-panel/chat-info-side-panel.component";
import { UserInfoSidePanelComponent } from "../../Components/user-info-side-panel/user-info-side-panel.component";

//rxjs
import {catchError, concatMap, forkJoin, from, map, switchMap, tap} from 'rxjs';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { UserRelationshipService } from '../../services/UserRelationship.service';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {EditPublicChatDTO, PublicChat} from '../../models/PublicChat';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../Components/confirm-dialog/confirm-dialog.component';
import { UserRelationshipDTO } from '../../models/UserRelationship';
import {throws} from 'node:assert';



@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule, BaseUiComponent, NgFor, FormsModule, ChatInfoSidePanelComponent, UserInfoSidePanelComponent, MatButtonToggle, MatButtonToggleModule, MatBadgeModule, MatIconModule, MatButtonToggle, MatButtonModule, MatMenu, MatMenuItem, MatMenuTrigger, MatProgressSpinner, MatSlideToggle, MatFormField, MatFormField, MatInput, MatLabel, MatDialogModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  public loggedInUser: User = new User;
  public loggedInUsersFriends: UserGetterDTO[] = [];

  public usersChats: ChatGetterDTO[] = [];
  public filteredUserChats: ChatGetterDTO[] = []; //pridat vyhledavani
  public chatFilter: string = "";
  public chatMode: 'All' | 'Private' | 'Public' | 'Group' | 'Unread' = 'All';
  public activeChat: ChatGetterDTO = new ChatGetterDTO();
  public activeChatPanel: ChatPanelInfo = new ChatPanelInfo();
  public activeChatUsers: PublicUserDataDTO[] = [];

  public allMessages: Message[] = [];
  public filteredMessages: Message[] = [];
  public messageFilter: string = '';
  public pinnedMessages: Message[] = [];

  public allPublicChats: PublicChat[] = [];
  public allPublicChatsUserIsIn: ChatGetterDTO[] = [];

  public selectedUser: UserPanelInfo = new UserPanelInfo;

  public showPublicChats: boolean = false;
  public showOnlyPinnedMessages: boolean = false;
  public editingMessage: boolean = false;
  public showChatInfo: boolean = false;
  public showUserInfo: boolean = false;
  public reportPopup: boolean = false;
  public shake: boolean = false;
  public userPanelVisible: boolean = false;
  public chatPanelVisible: boolean = false;

  public creatingGroup: boolean = false;
  public newGroupName: string = '';

  newGroupIds: Set<number> = new Set();
  newMessage: Message = new Message;

  reportUserId: number = 0;
  messageOptionId: number = 0;

  typing: boolean = false;
  lastTypingSent: number = 0;
  typingUsers: Set<number> = new Set<number>();
  typingTimeouts: Map<number, any> = new Map<number, any>();

  public unreadCount: number = 0;
  public mode: 'Private' | 'Public' | 'CreatingGC' = 'Private';
  hideSingleSelectionIndicator = signal(true);

  searchChat: string = '';
  searchMessage: string = '';
  reportReason: string = '';

  public loadingChats: boolean = false;
  public loadingMessages: boolean = false;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private publicChatService: PublicChatService,
    private groupChatService: GroupChatService,
    private userChatRelationshipService: UserChatRelationshipService,
    private userRelationshipService: UserRelationshipService,
    private messageService: MessageService,
    private reportsService: ReportsService,
    private dialog: MatDialog) {
    this.newMessage.isEdited = false;
    this.newMessage.isPinned = false;
  }

  ngOnInit() {
    this.loadingMessages = true;
    this.loadingChats = true;

    forkJoin({
      loggedInUser: this.userService.getFromToken(),
      publicChats: this.publicChatService.getAllPublicChats(),
    }).pipe(
      tap(({loggedInUser, publicChats}) => {
        this.loggedInUser = loggedInUser;
        this.allPublicChats = publicChats;
      }),
      concatMap(({loggedInUser}) =>
        this.chatService.getChatsUserIsIn(loggedInUser.id).pipe(
          tap(chats => {
            this.usersChats = chats;
            this.filteredUserChats = [...chats];
            this.activeChat = chats[0];
            this.loadingChats = false;
          }),
          map((chats) => ({loggedInUser}))
        )
      ),
      concatMap(({loggedInUser}) =>
        from(this.messageService.startSignalConnection()).pipe(
          tap(() => {
          this.messageService.onNewMessage((userId, chatId) => {
            if (chatId === this.activeChat.id) {
              this.refreshMessages(false);
            }
          });

          this.messageService.onTypingSignal((userId, chatId) => {
              if (chatId === this.activeChat.id) {
                this.typingUsers.add(userId);

                if (this.typingTimeouts.has(userId)) {
                  clearTimeout(this.typingTimeouts.get(userId));
                }

                const timeout = setTimeout(() => {
                  this.typingUsers.delete(userId);
                  this.typingTimeouts.delete(userId);
                }, 3000);

                this.typingTimeouts.set(userId, timeout);
                this.scrollToBottom();
              }
            });
          }),
          map(() => ({loggedInUser}))
        )
      ),
      concatMap(({loggedInUser}) =>
        this.userRelationshipService.getAllFriends(loggedInUser.id).pipe(
          tap(result => {
            this.loggedInUsersFriends = result;
          })
        )
      ),
      concatMap(() =>
        this.messageService.getMessagesInChat(this.loggedInUser.id, this.activeChat.id).pipe(
          tap(messages => {
            this.allMessages = messages;
            this.filteredMessages = [...this.allMessages];
            this.pinnedMessages = messages.filter(message => message.isPinned);
            this.loadingMessages = false;
          })
        )
      ),
      concatMap(() =>
        this.userChatRelationshipService.getUsersInChat(this.activeChat.id).pipe(
          tap(users => {
            this.activeChatUsers = users;
          })
        )
      )
    ).subscribe({
      next: () => console.log('Initialization complete'),
      error: err => console.error('Init error:', err)
    });
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

  onTyping() {
    const now = Date.now();
    const throttleDelay = 3000;
    this.scrollToBottom();

    if (now - this.lastTypingSent > throttleDelay) {
      const dto = new UserChatRelationshipDTO();
      dto.userId = this.loggedInUser.id;
      dto.chatId = this.activeChat.id;

      this.messageService.sendTypingSignalR(dto);
      this.lastTypingSent = now;
    }
  }

  userIsOwner(): boolean {
    const chatOwner = this.activeChat.ownerId ?? 0;
    return chatOwner === this.loggedInUser.id;
  }


  //refreshing

  refreshMessages(loadingMessages: boolean = true, scrollToBottom: boolean = true) {
    this.loadingMessages = loadingMessages;

    this.messageService.getMessagesInChat(this.loggedInUser.id, this.activeChat.id).subscribe({
      next: (messages) => {
        if (this.showOnlyPinnedMessages) {
          this.allMessages = messages.filter(message => message.isPinned);
          this.filteredMessages = [...this.allMessages];
          this.messageOptionId = 0;
        } else {
          this.allMessages = messages;
          this.filteredMessages = [...this.allMessages];
          this.messageOptionId = 0;
        }
      },
      error: err => {
        console.error('Init error:', err);
      },
      complete: () => {
        if (scrollToBottom) {
          setTimeout(() => this.scrollToBottom(), 1);
        }
        this.loadingMessages = false;
      }
    });
  }

  refreshChats() {
    this.loadingChats = true;

    this.chatService.getChatsUserIsIn(this.loggedInUser.id).subscribe({
      next: (chats) => {
        this.filterChats(chats);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.filteredUserChats = [...this.usersChats];
        this.activeChat = this.usersChats[0];
        this.refreshMessages();
        this.loadingChats = false;
      }
    });
  }

  filterChats(chats: ChatGetterDTO[]) {
    if (this.chatMode === 'All') {
      this.filteredUserChats = chats;
    } else if (this.chatMode === 'Unread') {
      this.filteredUserChats = chats.filter(chat => chat.unreadMessages !== 0);
    } else {
      this.filteredUserChats = chats.filter(chat => chat.chatType === this.chatMode);
    }
  }

  changeActiveChat(chat: ChatGetterDTO) {
    if (this.creatingGroup || this.activeChat.id === chat.id) {
      return;
    }
    this.messageService.startSignalConnection();
    this.activeChat = chat;
    this.activeChat.unreadMessages = 0;
    this.userChatRelationshipService.getUsersInChat(this.activeChat.id).subscribe(result => this.activeChatUsers = result)
    this.loadingMessages = false;
    this.refreshMessages();
    this.newMessage = new Message();
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


  //public chat logic

  publicChatLogic(chatId: number, isUserInPublicChat: boolean) {
    if (isUserInPublicChat) {
      this.addUserToPublicChat(chatId);
    } else {
      this.removeUserFromPublicChat(chatId);
    }
  }

  addUserToPublicChat(chatId: number) {
    let dto: UserChatRelationshipDTO = {
      userId: this.loggedInUser.id,
      chatId: chatId,
    };

    this.userChatRelationshipService.joinPublicChat(dto).subscribe({
      error: err => {
        console.log('Failed to add user', err);
      },
      complete: () => {
        this.refreshChats();
      }
    });
  }

  removeUserFromPublicChat(chatId: number): void {

    this.userChatRelationshipService.leavePublicChat(chatId, this.loggedInUser.id)
      .subscribe({
        error: err => {
          console.error('Failed to remove user:', err);
        },
        complete: () => {
          this.refreshChats();
        }
      });
  }

  isUserInPublicChat(chatId: number): boolean {
    return this.filteredUserChats.some(chat => chat.id === chatId);
  }


  //searching a filtering

  searchForChat() {
    this.filteredUserChats = this.usersChats.filter(chat => chat.title.toLowerCase().includes(this.chatFilter));  //nefunguje to vole uchyle
  }

  searchForMessage() {
    this.filteredMessages = this.allMessages.filter(message => message.content.toLowerCase().includes(this.messageFilter));
  }

  setChatFilter(mode: 'All' | 'Private' | 'Public' | 'Group' | 'Unread') {
    this.chatMode = mode;
    this.filterChats(this.usersChats);
  }


  //message veci

  async sendMessage() {
    console.log('Sending message...');

    if (this.activeChat.id == null) {
      throw new Error("Chat not selected");
    }
    if (!this.newMessage.content) {
      return;
    }

    if (this.editingMessage) {
      this.messageService.editMessage(this.loggedInUser.id, this.newMessage.id, this.newMessage.content).subscribe(_ => {
        this.newMessage.content = '';
        this.refreshMessages(false)
      });
      this.editingMessage = false;
    } else {
      this.newMessage.userId = this.loggedInUser.id;
      this.newMessage.chatId = this.activeChat.id;
      this.messageService.createMessage(this.newMessage).pipe(
        catchError(error => {
          throw error
        })
      ).subscribe(_ => this.refreshMessages(false));
      this.newMessage.content = '';
      await this.messageService.sendMessageSignalR(this.newMessage);
      this.refreshMessages(false);
      this.newMessage.content = '';
    }
  }

  async deleteMessage(messageId: number) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: {
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      this.messageService.deleteMessage(this.loggedInUser.id, messageId).subscribe(_ => this.refreshMessages(false, false));
    } else {
      console.log('User canceled.');
    }
  });
  await this.messageService.sendMessageSignalR(this.newMessage);
}

  pinMessage(messageId: number) {
    this.messageService.pinMessage(this.loggedInUser.id, messageId).subscribe(_ => this.refreshMessages(false, false));
  }


//group chat

  onUserToggle(userId: number, add: boolean) {
    if (add) {
      this.newGroupIds.add(userId);
    } else {
      this.newGroupIds.delete(userId);
    }
  }

  createGroup() {
    console.log('Create Group');
    console.log(this.newGroupName)

    if (!this.newGroupName.trim()) {
      this.shake = true;
      setTimeout(() => this.shake = false, 500);
      return;
    }
    if (this.newGroupIds.size < 1) {
      return;
    }

    let newGroupChat = new CreateGroupChatDTO();
    newGroupChat.creatorId = this.loggedInUser.id;
    newGroupChat.title = this.newGroupName;
    newGroupChat.chatIds = [...this.newGroupIds];

    this.groupChatService.createGroupChat(newGroupChat).subscribe(_ => {
      this.mode = 'Private';
      this.creatingGroup = false
    });
  }


//side panel

  public goToUser(userId: number): void {
    let user: UserGetterDTO = new UserGetterDTO;

    this.userService.getUser(userId).subscribe({
      next: result => {
        user = result;
        console.log(result);
      },
      error: err => {
        console.log('Failed to retrieve user:', err);
      },
      complete: () => {
        this.selectedUser = {
          id: user?.id ?? 0,
          username: user?.username ?? 'Not found',
          email: user?.email ?? 'Private account',
          bio: user?.bio ?? 'Not set',
          createdAt: user?.createDate ?? 'Not created',
          banEnd: user?.banEnd ?? 'Not banned',
          reportCount: user?.reportCount ?? 'Not reported',
          password: ''
        };

        console.log(this.selectedUser)

        this.userPanelVisible = true;
      }
    })
  }

  closePanel() {
    this.userPanelVisible = false;
    this.chatPanelVisible = false;
    this.selectedUser = new UserPanelInfo();
    this.activeChatPanel = new ChatPanelInfo();
  }



  //chat side panel


  showInfoAboutChat(chat: ChatGetterDTO) {
    if (chat.chatType === 'Private' && this.loggedInUser !== undefined) {
      this.goToUser(this.activeChatUsers.find(user => user.id !== this.loggedInUser.id)?.id ?? this.loggedInUser.id);
    } else {
      this.activeChatPanel = Object.assign(new ChatPanelInfo(), {
        id: this.activeChat.id,
        title: this.activeChat.title,
        activeUserUsername: this.loggedInUser.username,
        users: this.activeChatUsers.filter(user => user.id !== this.loggedInUser.id)
      });

      console.log(this.loggedInUser.username);
      console.log(this.activeChatPanel);

      this.chatPanelVisible = true;
    }
  }

  editChat(editedChat: ChatPanelInfo) : void {
    let dto = new EditPublicChatDTO();

    dto.chatId = editedChat.id;
    dto.title = editedChat.title;
    dto.description = editedChat.description;

    console.log(dto);

    this.userService.getFromToken().pipe(tap(result => {
        dto.userId = result.id
        console.log(dto);
      }), switchMap(() => this.groupChatService.editGroupChat(dto)),
      switchMap(() => this.chatService.getPublicChatsAdminView())
    ).subscribe(result => {
      this.refreshChats();
    })
  }

  deleteChat(chatId: number): void {
    this.userService.getFromToken().pipe(
      tap(result => {
        console.log("User data retrieved", result);
        this.publicChatService.deletePublicChat(result.id, chatId).subscribe({
          next: () => {
            console.log('Chat deleted successfully');
          },
          error: (err) => {
            console.error('Error deleting chat:', err);
          }
        });
      }), switchMap(() => this.chatService.getPublicChatsAdminView())
    ).subscribe(result => {
      console.log("Chats refreshed", result);
      this.refreshChats();
    })
  }




  areThereUnreadChats(): boolean {
    return this.usersChats.some(chat => chat.unreadMessages > 0);
  }

  editMessage(messageId: number) {
    console.log("edit message");
    let message = this.allMessages.find(m => m.id === messageId)!;
    this.editingMessage = true;
    this.newMessage = message;
    this.messageOptionId = 0;
  }

}



/*this.messageService.createMessage(this.newMessage).pipe(
      catchError(error =>{throw error})
    ).subscribe(_ => this.refreshMessages());
this.newMessage.content = '';
await this.messageService.sendMessageSignalR(this.newMessage);
this.refreshMessages();
this.newMessage.content = '';
}


/* VSECHNY UNUSED METODY

switchPanel(username: string) {
this.selectedUser = this.getUser(username);
this.showUserInfo = true;
}


chatInfo(){
this.showChatInfo = !this.showChatInfo;
}

muteUser(userId: number){

}

reportUser(){
let createReportDTO = new CreateReportDTO;
createReportDTO.requestorId = this.loggedInUser.id;
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
this.groupChatService.deleteGroupChat(this.loggedInUser.id, chatId).subscribe(_ => this.mode = "Private");
}

editChat(editedChat: ChatPanelInfo) {
let newChat = new EditGroupChatDTO();
newChat.chatId = editedChat.id;
newChat.title = editedChat.title;
newChat.userId = this.loggedInUser.id;
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



getChats(): ChatGetterDTO[]{
let chats = this.creatingGroup ? this.usersChats : this.chats;
chats = this.showPublicChats ? this.allPublicChats : chats;
if (!this.searchChat?.trim()) {
return chats;
}

const query = this.searchChat.toLowerCase();
return chats.filter(chat =>
chat.title.toLowerCase().includes(query)
);
}

getMessages(): Message[]{
const messages = this.showOnlyPinnedMessages ? this.allMessages.filter(m => m.isPinned === true) : this.allMessages;
if (!this.searchMessage?.trim()) {
return messages;
}

const query = this.searchMessage.toLowerCase();
return messages.filter(message =>
message.content.toLowerCase().includes(query)
);
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
this.messageService.editMessage(this.loggedInUser.id, this.newMessage.id, this.newMessage.content).subscribe(_ => {this.newMessage.content = ''; this.refreshMessages()});
this.editingMessage = false;
} else {
this.newMessage.userId = this.loggedInUser.id;
this.newMessage.chatId = this.activeChat.id;
/*this.messageService.createMessage(this.newMessage).pipe(
      catchError(error =>{throw error})
    ).subscribe(_ => this.refreshMessages());
this.newMessage.content = '';
await this.messageService.sendMessageSignalR(this.newMessage);
this.refreshMessages();
this.newMessage.content = '';
}
}

changeChatsToPublic(){
this.showPublicChats = true;
this.setChats();
this.publicChatService.getAllPublicChats().subscribe(result => {
this.allPublicChats = result;
this.loadingChats = false;
});
}

createGroupSetup() {
this.creatingGroup = !this.creatingGroup;
this.setChats();
this.newGroupIds = [];
this.newGroupName = "";
this.chatService.getPrivateChatsUserIsIn(this.loggedInUser.id).subscribe(resutl => {this.usersChats = resutl; this.loadingChats = false});
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
newGroupChat.creatorId = this.loggedInUser.id;
newGroupChat.title = this.newGroupName;
newGroupChat.chatIds = this.newGroupIds;

this.groupChatService.createGroupChat(newGroupChat).subscribe(_ => {this.mode = 'Private'; this.creatingGroup = false});
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

*/

