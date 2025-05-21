import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseUiComponent } from "../../Components/base-ui/base-ui.component";
import { CreatePublicChatDTO, PublicChatGetterDTO } from '../../models/PublicChat';
import { ChatService } from '../../services/ChatService';
import { PublicChatService } from '../../services/PublicChat.service';
import { UserService } from '../../services/User.service';


@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [NgFor, FormsModule, BaseUiComponent],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {
  public chats: PublicChatGetterDTO[] = [];
  public filteredChats = [...this.chats];

  public newChatName: string = '';


  constructor(private chatService: ChatService, private publicChatService: PublicChatService, private userService: UserService) {

  }


  ngOnInit() {
    this.chatService.getPublicChatsAdminView().subscribe(result => {
      this.chats = result;
      this.filteredChats = [...this.chats];
    });
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
}
