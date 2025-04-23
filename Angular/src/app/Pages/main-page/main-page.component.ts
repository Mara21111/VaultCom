import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent, NgFor],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  
  data = inject(DataService)
  public_chats: boolean = false;

  changeChatsToPublic(){
    this.public_chats = true;
  }

  changeChatsToPrivate(){
    this.public_chats = false;
  }

  formatDate(timestamp: string): string {
    const messageDate = new Date(timestamp);  // Convert the string timestamp to a Date object
    const now = new Date();
    
    const diff = now.getTime() - messageDate.getTime();
    const hoursDifference = diff / (1000 * 3600);
    
    if (hoursDifference < 24) {
      // If the message was sent within the last 24 hours, show the time
      return messageDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});  // Time format (HH:mm)
    } else {
      // If the message was sent more than 24 hours ago, show the date (DD.MM)
      return `${messageDate.getDate()}.${messageDate.getMonth() + 1}`;
    }
  }
}