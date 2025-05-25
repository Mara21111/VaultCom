import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, ChatGetterDTO } from '../models/Chat';
import { Observable, retry } from 'rxjs';
import { User } from '../models/User';
import { UserChatRelationship } from '../models/UserChatRelationship';
import { link } from 'fs';
import {PublicChatGetterDTO} from '../models/PublicChat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public constructor(private http: HttpClient) {

  }

  public getAllPublicChats(): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>('http://localhost:5000/api/Chat/get-all-public-chats')
  }

  public getChatsUserIsIn(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-chats-user-is-in-${userId}`);
  }

  public getPublicChatsUserIsIn(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-public-chats-user-is-in-${userId}`);
  }

  public getPublicChatsUserIsNotIn(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-public-chats-user-is-not-in-${userId}`);
  }

  public getPublicChatsUserHasMuted(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-public-chats-user-has-muted-${userId}`);
  }

  public getPublicChatsUserHasNotMuted(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-public-chats-user-has-not-muted-${userId}`);
  }

  public getGroupChatsUserIsIn(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-group-chats-user-is-in-${userId}`);
  }

  public getGroupChatsUserHasMuted(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-group-chats-user-has-muted-${userId}`);
  }

  public getGroupChatsUserHasNotMuted(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-group-chats-user-has-not-muted-${userId}`);
  }

  public getPrivateChatsUserIsIn(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-private-chats-user-is-in-${userId}`);
  }

  public getPrivateChatsUserHasMuted(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-private-chats-user-has-muted-${userId}`);
  }

  public getPrivateChatsUserHasNotMuted(userId: number): Observable<ChatGetterDTO[]> {
    return this.http.get<ChatGetterDTO[]>(`http://localhost:5000/api/Chat/get-private-chats-user-has-not-muted-${userId}`);
  }

  public getPublicChatsAdminView(): Observable<PublicChatGetterDTO[]> {
    return this.http.get<PublicChatGetterDTO[]>('http://localhost:5000/api/Chat/get-public-chats-admin-view');
  }














  //tohle uz neni v api

  public CreateLink(link: UserChatRelationship): Observable<UserChatRelationship>{
    return this.http.post<UserChatRelationship>('http://localhost:5000/api/UserChat/create-user-chat-link', link);
  }

  public DeleteLink(userId: number, chatId: number): Observable<UserChatRelationship> {
    return this.http.delete<UserChatRelationship>('http://localhost:5000/api/UserChat/delete-user' + userId + '-chat' + chatId + '-link')
  }

  public UsersInChat(id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserChat/users-in-chat-' + id);
  }

  public UserInChat(userId: number, chatId: number): Observable<boolean>{
    return this.http.get<boolean>('http://localhost:5000/api/UserChat/is-user' + userId + '-in-chat' + chatId)
  }

  public SearchForChat(prompt: string, user_id: number): Observable<void> {
    return this.http.get<void>('http://localhost:5000/api/UserChat/search-for-chat-' + prompt + '-' + user_id)
  }

  public newLink(userId: number, chatId: number): UserChatRelationship {
    let link = new UserChatRelationship();

    link.chatId = chatId;
    link.userId = userId;
    link.mutedChat = false;
    link.id = 0;

    return link;
  }
}
