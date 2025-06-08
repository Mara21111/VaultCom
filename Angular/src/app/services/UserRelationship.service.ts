import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {BaseUserDataDTO, User, UserGetterDTO} from '../models/User'
import { UserRelationshipDTO } from '../models/UserRelationship';

@Injectable({
  providedIn: 'root'
})
export class UserRelationshipService {
  public constructor(private http: HttpClient) {

  }

  public sendFriendRequest(request: UserRelationshipDTO): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/send-friend-request', request);
  }

  public acceptFriendRequest(request: UserRelationshipDTO): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/accept-friend-request', request)
  }

  public getIncomingFriendRequests(userId: number): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>(`http://localhost:5000/api/UserRelationship/get-incoming-friend-requests-${userId}`)
  }

  public getAllSentRequests(userId: number): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>(`http://localhost:5000/api/UserRelationship/get-outcoming-friend-requests-${userId}`);
  }

  public getAllFriends(userId: number): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>(`http://localhost:5000/api/UserRelationship/get-friends-${userId}`);
  }

  public removePendign(request: UserRelationshipDTO): Observable<void> {
    return this.http.put<void>('http://localhost:5000/api/UserRelationship/remove-pending', request);
  }
}
