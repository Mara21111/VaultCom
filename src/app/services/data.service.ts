import { Injectable } from '@angular/core';
import { Chat } from "../models/Chat";
import { User } from "../models/User"
import { Report_log } from '../models/Report_log';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  chats: Chat[] = [];
  users: User[] = [];
  reports: Report_log[] = [];

    constructor() {
        for (let i = 1; i <= 10; i++) {
          this.chats.push({
            id: i,
            is_public: true,
            name: 'test' + i,
            description: '',
            creator_id: 1
          });

          this.users.push({
            username: `IM_DUMB_USER_BAN_ME_PLS${i}`,
            bio: `Bio ${i}`,
            id: i,
            email: `horribleguy@gmail.com`,
            password: 'password',
            phone_number: `+4201234567${i}`,
            status: 0,
            is_public: true,
            is_admin: false,
            created_at: new Date(),
            private_key: '',
            public_key: '',
            timeout_end: new Date(),
            ban_end: new Date(),
            safe_mode: false
          });

          this.reports.push({
            user_id: i,
            reported_user_id: i * 20,
            message: "test"
          });

        }
      }
}
