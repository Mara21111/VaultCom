import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/User';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-admin-all-users-page',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './admin-all-users-page.component.html',
  styleUrl: './admin-all-users-page.component.scss'
})
export class AdminAllUsersPageComponent {

  users: User[] = [];

  constructor() {
    for (let i = 1; i <= 10; i++) {
      this.users.push({
        username: `IM_DUMB_USER_BAN_ME_PLS${i}`,
        bio: `Bio ${i}`,
        id: i,
        email: `horribleguy@gmail.com`,
        password: 'password',
        phone_number: `+4201234567${i}`,
        status: 0,
        is_public: false,
        is_admin: false,
        created_ad: new Date(),
        private_key: '',
        public_key: '',
        timeout_end: new Date(),
        ban_end: new Date(),
        safe_mode: false
      });
    }
  }
}
