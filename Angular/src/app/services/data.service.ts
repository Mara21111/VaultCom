import { Injectable } from '@angular/core';
import { Chat } from "../models/Chat";
import { User } from "../models/User"
import { Report_log } from '../models/Report_log';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  chats: Chat[] = [];
  users: User[] = [];
  reports: Report_log[] = [];
  messages: Message[] = [];

    constructor() {
        for (let i = 1; i <= 20; i++) {
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
            phone_Number: `+4201234567${i}`,
            status: 0,
            is_Public: true,
            is_Admin: false,
            created_At: new Date(),
            private_key: '',
            public_key: '',
            timeout_End: new Date(),
            ban_End: new Date(),
            safe_mode: false
          });

          this.reports.push({
            user_Id: i,
            reported_User_Id: i * 20,
            message: "test"
          });

          this.messages.push({
            id: i,
            chat_Id: 1,
            user_Id: 1,
            previous_Message_Id: 0,
            content: 'test' + i,
            url_Link: '',
            time: new Date(),
            is_Edited: false,
            is_Single_Use: false,
            is_Pinned: false
          });

        }
      }
}
