import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-public-chats-page',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {

  data = inject(DataService)

}
