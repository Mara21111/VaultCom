import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat } from '../models/Chat';
import {EditPublicChatDTO, PublicChat} from "../models/PublicChat";
import { Observable, retry } from 'rxjs';
import { CreatePublicChatDTO } from '../models/PublicChat';

@Injectable({
  providedIn: 'root'
})
export class PublicChatService {

  public constructor(private http: HttpClient) {

  }

  public getAllPublicChats(): Observable<PublicChat[]> {
    return this.http.get<PublicChat[]>(`http://localhost:5000/api/Chat/get-all-public-chats`);
  }

  public createPublicChat(createdChat: CreatePublicChatDTO): Observable<Chat> {
    return this.http.post<Chat>('http://localhost:5000/api/PublicChat/create-public-chat', createdChat)
  }

  public editPublicChat(editedChat: EditPublicChatDTO): Observable<Chat> {
    return this.http.put<Chat>('http://localhost:5000/api/PublicChat/edit-public-chat', editedChat)
  }

  public deletePublicChat(userId: number, chatId: number): Observable<void> {
    console.log('a');
    return this.http.delete<void>(`http://localhost:5000/api/PublicChat/delete-public-chat-${userId}-${chatId}`);
  }
}
