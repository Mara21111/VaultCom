import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) { }

  public getMessagesInChat(chatId: number): Observable<Message[]>{
    return this.http.get<Message[]>('http://localhost:5000/api/Message/get-messages-from-chat' + chatId)
  }

    public createMessage(message: Message): Observable<Message> {
      return this.http.post<Message>('http://localhost:5000/api/Message/create-message', message);
    }
}
