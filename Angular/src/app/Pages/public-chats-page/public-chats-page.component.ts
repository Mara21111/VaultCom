import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent, FormsModule],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {

  data = inject(DataService)

  chatName: string = "";

  createChat() {
    this.data.chats.push({
      id: this.data.chats.length + 1,
      is_public: true,
      name: this.chatName,
      description: '',
      creator_id: 1
    })

    this.chatName = '';
  }
}