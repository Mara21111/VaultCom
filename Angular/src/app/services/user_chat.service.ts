import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserChatService {

  public constructor(private http: HttpClient) {}

  public getAllUsersChats(user_id: number): Observable<Chat[]> {
    return this.http.get<Chat[]>('http://localhost:5000/api/Chat/user' + user_id + 's-chats');
  }

  public createChat(chat: Chat): Observable<Chat> {
    return this.http.post<Chat>('http://localhost:5000/api/Chat/create-chat', chat)
  }

  public deleteChat(id: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/Chat/delete-chat')
  }

  public chatsUserIsIn(id: number): Observable<Chat[]> {
    return this.http.get<Chat[]>('http://localhost:5000/api/UserChat/chats-user' + id + '-is-in')
  }

  public newPublicChat(name: string): Chat {
    let chat = new Chat();
    chat.id = 0;
    chat.is_public = true;
    chat.name = name;
    chat.description = '';
    chat.creator_id = 1;
    return chat;
  }
}
