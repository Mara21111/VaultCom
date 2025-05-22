import { Component } from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { CreatePublicChatDTO, PublicChatGetterDTO } from '../../models/PublicChat';
import { ChatService } from '../../services/ChatService';
import { PublicChatService } from '../../services/PublicChat.service';
import { UserService } from '../../services/User.service';
import {ChatPanelInfo} from '../../models/Chat';
import {UserChatRelationship} from '../../models/UserChatRelationship';
import {UserChatRelationshipService} from '../../services/UserChatRelationship.service';
import {UserPanelInfo} from '../../models/User';
import {ChatInfoSidePanelComponent} from '../../Components/chat-info-side-panel/chat-info-side-panel.component';


@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [NgFor, FormsModule, BaseUiComponent, ChatInfoSidePanelComponent, NgIf],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {
  public chats: PublicChatGetterDTO[] = [];
  public filteredChats = [...this.chats];

  public newChatName: string = '';

  public panelVisible: boolean = false;
  public selectedChat: ChatPanelInfo = new ChatPanelInfo();
  public activeUserName: string = '';


  constructor(
    private chatService: ChatService,
    private publicChatService: PublicChatService,
    private userService: UserService,
    private userChatRelationshipService: UserChatRelationshipService
  ) {

  }


  ngOnInit() {
    this.chatService.getPublicChatsAdminView().subscribe(result => {
      this.chats = result;
      this.filteredChats = [...this.chats];
    });
    this.userService.getFromToken().subscribe(result => this.activeUserName = result.username);
  }

  onSearchChanged(value: string) {
    this.filteredChats = this.chats.filter(chat => chat.title.toLowerCase().includes(value.toLowerCase()));
  }

  createChat(): void {
    let dto = new CreatePublicChatDTO();

    this.userService.getFromToken().subscribe(result => dto.creatorId = result.id)
    dto.title = this.newChatName;
    dto.desc = ''; //to bych do budoucna fixnul ngl

    this.publicChatService.createPublicChat(dto);
  }

  deleteChat(chat_id: number): void {

  }

  public goToPublicChat(chatId: number) {
    let selectedChat = this.chats.find(x => x.id === chatId);

    if (selectedChat !== undefined){
      this.selectedChat.title = selectedChat.title;
      this.selectedChat.desc = selectedChat.desc;
      this.selectedChat.activeUserName = this.activeUserName;
    }

    this.userChatRelationshipService.getUsersInChat(chatId).subscribe(result => {
      this.selectedChat.users = result;
      console.log(result);
    });

    /*
    this.userChatRelationshipService.getUsersInChat(chatId).subscribe(result => {
  this.selectedChat.userNames = result
    .filter(user => user.id !== 123)           // vynechá uživatele s id 123
    .map(user => user.username);               // vrátí seznam username
});
     */

    this.panelVisible = true;
  }

  public closePanel() {
    this.panelVisible = false;
    this.selectedChat = new ChatPanelInfo();
  }
}
