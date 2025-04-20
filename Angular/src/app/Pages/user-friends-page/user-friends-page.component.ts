import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { BaseUiComponent } from "../base-ui/base-ui.component";

@Component({
  selector: 'app-user-friends-page',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgFor, BaseUiComponent],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})
export class UserFriendsPageComponent {

  data = inject(DataService)
}
