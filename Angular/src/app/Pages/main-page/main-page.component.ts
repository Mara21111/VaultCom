import { CommonModule, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BaseUiComponent } from "../base-ui/base-ui.component";
import { DataService } from '../../services/data.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, BaseUiComponent, NgFor, FormsModule ] ,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
  
  data = inject(DataService)
  public_chats: boolean = false;
  
  message: string = '';

  changeChatsToPublic(){
    this.public_chats = true;
  }

  changeChatsToPrivate(){
    this.public_chats = false;
  }

  sendMessage(form: NgForm){
    console.log(this.message)
    this.message = '';
  }
}