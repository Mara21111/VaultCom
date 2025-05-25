import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BaseUserDataDTO, CreateUserDTO, PublicUserDataDTO} from '../models/User';
import { Observable } from 'rxjs';
import { UserChatRelationshipDTO } from '../models/UserChatRelationship';

@Injectable({
  providedIn: 'root'
})
export class UserChatRelationshipService {

  public constructor(private http: HttpClient) {

  }

  public joinPublicChat(relationship: UserChatRelationshipDTO): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserChatRelationship/join-public-chat', relationship);
  }

  public muteChatToggle(relationship: UserChatRelationshipDTO): Observable<UserChatRelationshipDTO> {
    return this.http.put<UserChatRelationshipDTO>('http://localhost:5000/api/UserChatRelationship/mute-chat-toggle', relationship);
  }

  public getUsersInChat(chatId: number): Observable<PublicUserDataDTO[]> {
    return this.http.get<PublicUserDataDTO[]>(`http://localhost:5000/api/UserChatRelationship/get-users-in-chat-${chatId}`);
  }

  public leavePublicChat(chatId: number, userId: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/UserChatRelationship/leave-public-chat');
  }
}
