import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User'

@Injectable({
  providedIn: 'root'
})
export class UserRelationshipService {
  public constructor(private http: HttpClient) {

  }

  //nejsou z api, jen predloha
  public GetAllFriendRequests(user_id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserRelationship/neco' + user_id)
  }
  public GetAllFriends(user_id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserRelationship/necotady-' + user_id);
  }

  public GetAllSentRequests(user_id: number): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/UserRelationship/neconeco-' + user_id);
  }
}
