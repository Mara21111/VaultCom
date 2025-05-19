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

  public createGroupChat(CreatedGroupChat: CreateGroupChatDTO): Observable<Message[]>{
    return this.http.post<Message[]>('http://localhost:5000/api/Message/create-group-chat', CreatedGroupChat)
  }
}
