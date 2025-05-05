import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User'
import { URHelpModule } from '../models/URHelpModule';

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

  public sendRequest(URHepl: URHelpModule): Observable<URHelpModule> {
    return this.http.post<URHelpModule>('http://localhost:5000/api/UserRelationship/send-request', URHepl)
  }

  public cancelRequest(URHepl: URHelpModule): Observable<URHelpModule> {
    return this.http.post<URHelpModule>('http://localhost:5000/api/UserRelationship/cancel-request', URHepl)
  }

  public acceptRequest(URHepl: URHelpModule): Observable<URHelpModule> {
    return this.http.post<URHelpModule>('http://localhost:5000/api/UserRelationship/accept-request', URHepl)
  }

  public toggleBlockUser(URHepl: URHelpModule): Observable<URHelpModule> {
    return this.http.post<URHelpModule>('http://localhost:5000/api/UserRelationship/toggle-block', URHepl)
  }

  public toggleMuteUser(URHepl: URHelpModule): Observable<URHelpModule> {
    return this.http.post<URHelpModule>('http://localhost:5000/api/UserRelationship/toggle-mute', URHepl)
  }

  public changeNickname(URHepl: URHelpModule): Observable<URHelpModule> {
    return this.http.post<URHelpModule>('http://localhost:5000/api/UserRelationship/change-nickname', URHepl)
  }

  public unfriendUser(URHepl: URHelpModule): Observable<URHelpModule> {
    return this.http.post<URHelpModule>('http://localhost:5000/api/UserRelationship/unfriend-from', URHepl)
  }
}