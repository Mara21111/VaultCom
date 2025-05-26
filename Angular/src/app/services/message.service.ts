import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  public getMessagesInChat(userId: number, chatId: number): Observable<Message[]>{
    return this.http.get<Message[]>(`http://localhost:5000/api/Message/get-messages-in-chat-${userId}-${chatId}`)
  }

  public createMessage(message: Message): Observable<Message> {
    return this.http.post<Message>('http://localhost:5000/api/Message/send-message', message);
  }

  public pinMessage(userId: number, messageId: number): Observable<void> {
    return this.http.put<void>(`http://localhost:5000/api/Message/pin-message-${userId}-${messageId}`, null);
  }

  public editMessage(userId: number, messageId: number, newContent: string): Observable<void> {
    return this.http.put<void>(`http://localhost:5000/api/Message/edit-message-${userId}-${messageId}-${newContent}`, null);
  }

  public deleteMessage(userId: number, messageId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5000/api/Message/delete-message-${userId}-${messageId}`);
  }

}
