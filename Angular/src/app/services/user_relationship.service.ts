import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User'

@Injectable({
  providedIn: 'root'
})
export class UserRelationshipService {

  public constructor(private http: HttpClient) {}

  public getAllFriends(user_id: number): Observable<User[]> {
    console.log(user_id)
    return this.http.get<User[]>('http://localhost:5000/api/UserRelationship/friends-of-user' + user_id)
  }

  public getAllIncomingRequests(user_id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserRelationship/pending-requests-to-user' + user_id)
  }

  public getAllOutgoingRequests(user_id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserRelationship/pending-requests-from-user' + user_id)
  }

  public sendRequest(sender_id: number, reciever_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/send-request-from' + sender_id + '-to' + reciever_id, '')
  }

  public cancelRequest(sender_id: number, reciever_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/cancel-request-from' + sender_id + '-to' + reciever_id, '')
  }

  public acceptRequest(sender_id: number, reciever_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/accept-request-from' + sender_id + '-to' + reciever_id, sender_id)
  }

  public rejectRequest(sender_id: number, reciever_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/reject-request-from' + sender_id + '-to' + reciever_id, '')
  }

  public toggleBlockUser(user_id: number, blocked_user_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/toggle-' + user_id + '-block-' + blocked_user_id, '')
  }

  public toggleMuteUser(user_id: number, muted_user_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/toggle-' + user_id + '-mute-' + muted_user_id, '')
  }

  public changeNickname(user_id: number, friend_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/change-' + user_id + '-nickname-of-' + friend_id, '')
  }

  public unfriendUser(user_id: number, friend_id: number): Observable<void> {
    return this.http.post<void>('http://localhost:5000/api/UserRelationship/unfriend-' + friend_id + '-from-' + user_id, '')
  }
}