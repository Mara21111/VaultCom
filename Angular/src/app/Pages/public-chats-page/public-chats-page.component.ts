import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { CreatePublicChatDTO, EditPublicChatDTO, PublicChatGetterDTO } from '../../models/PublicChat';
import { ChatService } from '../../services/ChatService';
import { PublicChatService } from '../../services/PublicChat.service';
import { UserService } from '../../services/User.service';
import { ChatPanelInfo } from '../../models/Chat';
import { UserChatRelationship } from '../../models/UserChatRelationship';
import { UserChatRelationshipService } from '../../services/UserChatRelationship.service';
import { UserPanelInfo } from '../../models/User';
import { ChatInfoSidePanelComponent } from '../../Components/chat-info-side-panel/chat-info-side-panel.component';
import { switchMap, tap, forkJoin } from 'rxjs';


@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [NgFor, FormsModule, BaseUiComponent, ChatInfoSidePanelComponent, NgIf],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {
  public chats: PublicChatGetterDTO[] = [];
  public filteredChats: PublicChatGetterDTO[] = [...this.chats];

  public newChatName: string = '';
  public newChatDescription: string = '';

  public panelVisible: boolean = false;
  public selectedChat: ChatPanelInfo = new ChatPanelInfo();
  public activeUserName: string = '';

  public isAdding: boolean = false;
  public isLoading: boolean = false;



  constructor(
    private chatService: ChatService,
    private publicChatService: PublicChatService,
    private userService: UserService,
    private userChatRelationshipService: UserChatRelationshipService
  ) {

  }


  ngOnInit() {
    this.isLoading = true;

    forkJoin({
      chats: this.chatService.getPublicChatsAdminView(),
      user: this.userService.getFromToken()
    }).subscribe({
      next: ({ chats, user }) => {
        this.chats = chats;
        this.filteredChats = [...chats];
        this.activeUserName = user.username;
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }

  onSearchChanged(value: string) {
    this.filteredChats = this.chats.filter(chat => chat.title.toLowerCase().includes(value.toLowerCase()));
  }

  createChat(): void {
    let dto = new CreatePublicChatDTO();
    this.isAdding = true;

    this.userService.getFromToken().pipe(tap(user => {
        dto.creatorId = user.id;
        dto.title = this.newChatName;
        dto.description = ''; //to bych do budoucna fixnul ngl
      }), switchMap(() => this.publicChatService.createPublicChat(dto)),
      switchMap(() => this.chatService.getPublicChatsAdminView())
    ).subscribe(result => {
      this.newChatName = '';
      this.refresh(result);
      this.isAdding = false;
    })
  }

  editChat(editedChat: ChatPanelInfo) : void {
    let dto = new EditPublicChatDTO();

    dto.chatId = editedChat.id;
    dto.title = editedChat.title;
    dto.description = editedChat.description;

    this.userService.getFromToken().pipe(tap(result => {
      dto.userId = result.id
      console.log(dto);
    }), switchMap(() => this.publicChatService.editPublicChat(dto)),
    switchMap(() => this.chatService.getPublicChatsAdminView())
    ).subscribe(result => {
      this.refresh(result);
    })
  }

  deleteChat(chatId: number): void {
    this.isLoading = true;
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
      this.refresh(result);
    })
  }

  private refresh(chats: PublicChatGetterDTO[]) {
    this.selectedChat = new ChatPanelInfo();
    this.chats = chats;
    this.filteredChats = [...this.chats];
    this.closePanel();
    this.isLoading = false;
  }

  public goToPublicChat(chatId: number) {
    let selectedChat = this.chats.find(x => x.id === chatId);

    if (selectedChat !== undefined){
      this.selectedChat.id = selectedChat.id;
      this.selectedChat.title = selectedChat.title;
      this.selectedChat.description = selectedChat.description;
      this.selectedChat.activeUserName = this.activeUserName;
    }

    this.userChatRelationshipService.getUsersInChat(chatId).subscribe(result => {
      this.selectedChat.users = result;
      console.log(result);
    });

    this.panelVisible = true;
  }

  public closePanel() {
    this.panelVisible = false;
    this.selectedChat = new ChatPanelInfo();
  }
}
