import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../services/data.service';
import { User } from '../../models/User';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-user-info-page',
  imports: [RouterLinkActive, RouterLink, NgIf],
  templateUrl: './admin-user-info-page.component.html',
  styleUrl: './admin-user-info-page.component.scss'
})
export class AdminUserInfoPageComponent {

  data = inject(DataService)

  user: User = this.data.users[0];
}
