import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '../../models/User';

@Component({
  selector: 'app-user-friends-page',
  imports: [RouterLink, RouterLinkActive, NgFor],
  templateUrl: './user-friends-page.component.html',
  styleUrl: './user-friends-page.component.scss'
})
export class UserFriendsPageComponent {

  requests: User[] = [];
  friends: User[] = [];

  constructor() {
    for (let i = 1; i <= 10; i++) {
      this.requests.push({
        username: `pepa${i}`,
        bio: `Bio ${i}`,
        id: i,
        email: `pepa${i}@example.com`,
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

      this.friends.push({
        username: `pepa${i}`,
        bio: `Bio ${i}`,
        id: i,
        email: `pepa${i}@example.com`,
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
      })
    }
  }
}
