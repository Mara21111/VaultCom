import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/User';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-user-friends-page',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})
export class UserFriendsPageComponent {

  data = inject(DataService)
}
