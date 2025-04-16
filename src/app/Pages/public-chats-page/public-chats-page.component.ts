import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { NgFor } from '@angular/common';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-public-chats-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './public-chats-page.component.html',
  styleUrl: './public-chats-page.component.scss'
})

export class PublicChatsPageComponent {

  data = inject(DataService)

}
