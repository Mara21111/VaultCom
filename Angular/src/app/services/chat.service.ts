import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import { Observable, retry } from 'rxjs';
import { User } from '../models/User';
import { UserChatRelationship } from '../models/UserChatRelationship';
import { link } from 'fs';

@Injectable({
  providedIn: 'root'
})
export class UserChatService {

  public constructor(private http: HttpClient) {}

  public CreateLink(link: UserChatRelationship): Observable<UserChatRelationship>{
    return this.http.post<UserChatRelationship>('http://localhost:5000/api/UserChat/create-user-chat-link', link);
  }

  public DeleteLink(userId: number, chatId: number): Observable<UserChatRelationship> {
    return this.http.delete<UserChatRelationship>('http://localhost:5000/api/UserChat/delete-user' + userId + '-chat' + chatId + '-link')
  }

  public ChatsUserIsIn(id: number): Observable<Chat[]> {
    return this.http.get<Chat[]>('http://localhost:5000/api/UserChat/chats-user-' + id + '-is-in');
  }

  public UsersInChat(id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserChat/users-in-chat' + id);
  }

  public UserInChat(userId: number, chatId: number): Observable<boolean>{
    return this.http.get<boolean>('http://localhost:5000/api/UserChat/is-user' + userId + '-in-chat' + chatId)
  }

  public SearchForChat(prompt: string, user_id: number): Observable<void> {
    return this.http.get<void>('http://localhost:5000/api/UserChat/search-for-chat-' + prompt + '-' + user_id)
  }

  public newLink(userId: number, chatId: number): UserChatRelationship {
    let link = new UserChatRelationship();

    link.ChatId = chatId;
    link.UserId = userId;
    link.MutedChat = false;
    link.Id = 0;

    return link;
  }
}
