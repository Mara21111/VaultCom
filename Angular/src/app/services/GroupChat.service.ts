import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';
import { CreateGroupChatDTO } from '../models/GroupChat';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {
  constructor(private http: HttpClient) {

  }

  public createGroupChat(CreatedGroupChat: CreateGroupChatDTO): Observable<void>{
    return this.http.post<void>('http://localhost:5000/api/GroupChat/create-group-chat', CreatedGroupChat)
  }
}
