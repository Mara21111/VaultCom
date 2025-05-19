import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import { PublicChat } from "../models/PublicChat";
import { Observable, retry } from 'rxjs';
import { CreatePublicChatDTO } from '../models/PublicChat';

@Injectable({
  providedIn: 'root'
})
export class PublicChatService {

  public constructor(private http: HttpClient) {

  }

  public GetAllPublicChats(): Observable<PublicChat[]> {
    return this.http.get<PublicChat[]>('http://localhost:5000/api/Chat/all-public-chats');
  }

  public createPublicChat(CreatedChat: CreatePublicChatDTO): Observable<Chat> {
    return this.http.post<Chat>('http://localhost:5000/api/Chat/create-public-chat', CreatedChat)
  }

  public DeletePublicChat(chat_id: number, user_id: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/Chat/delete-chat-' + chat_id + '-' + user_id)
  }
}
