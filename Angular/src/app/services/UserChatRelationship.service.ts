import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BaseUserDataDTO, CreateUserDTO, PublicUserDataDTO} from '../models/User';
import { Observable } from 'rxjs';
import { UserChatRelationshipDTO } from '../models/UserChatRelationship';
import {UserRelationshipDTO} from '../models/UserRelationship';

@Injectable({
  providedIn: 'root'
})
export class UserChatRelationshipService {

  public constructor(private http: HttpClient) {

  }

  public joinPublicChat(relationship: UserRelationshipDTO): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserChatRelationship/join-public-chat', relationship);
  }

  public getUsersInChat(chatId: number): Observable<BaseUserDataDTO | PublicUserDataDTO> {
    return this.http.get<BaseUserDataDTO | PublicUserDataDTO>(`http://localhost:5000/api/UserChatRelationship/get-users-in-chat${chatId}`);
  }
}
