import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import { Observable, retry } from 'rxjs';
import { User } from '../models/User';
import { User_chat } from '../models/User_chat';
import { link } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class UserChatService {

  public constructor(private http: HttpClient) {}

  public createLink(link: User_chat): Observable<User_chat>{
    return this.http.post<User_chat>('http://localhost:5000/api/UserChat/create-user-chat-link', link);
  }

  public deteleLink(userId: number, chatId: number): Observable<User_chat> {
    return this.http.delete<User_chat>('http://localhost:5000/api/UserChat/delete-user' + userId + '-chat' + chatId + '-link')
  }

  public chatsUserIsIn(id: number): Observable<Chat[]> {
    return this.http.get<Chat[]>('http://localhost:5000/api/UserChat/chats-user' + id + '-is-in');
  }

  public usersInChat(id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserChat/users-in-chat' + id);
  }

  public userInChat(userId: number, chatId: number): Observable<boolean>{
    return this.http.get<boolean>('http://localhost:5000/api/UserChat/is-user' + userId + '-in-chat' + chatId)
  }

  public newLink(userId: number, chatId: number): User_chat {
    let link = new User_chat();
    
    link.chat_Id = chatId;
    link.user_Id = userId;
    link.muted_Chat = false;
    link.id = 0;

    return link;
  }
}
