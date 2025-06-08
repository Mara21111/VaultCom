import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { Message, MessageDTO } from '../models/Message';
import * as signalR from '@microsoft/signalR';
import { UserChatRelationshipDTO } from '../models/UserChatRelationship';
import { UserRelationshipDTO } from '../models/UserRelationship';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private hubConnection!: signalR.HubConnection;
  private connectionPromise!: Promise<void>;

  constructor(private http: HttpClient) { }

  public startSignalConnection(): Promise<void> {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/chathub', { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    this.connectionPromise = this.hubConnection
      .start()
      .then()
      .catch(err => {
        console.error('❌ SignalR chyba:', err);
        throw err;
     });

    return this.connectionPromise;
  }

  public sendMessageSignalR(dto: Message) {
    return this.hubConnection.invoke('SendMessage', dto)
      .catch(err => console.error(err));
  }

  public sendTypingSignalR(dto: UserChatRelationshipDTO) {
    console.log("sending typing signal");
    return this.hubConnection.invoke('StartTyping', dto)
      .catch(err => console.error(err));
  }

  public sendStopTypingSignalR(dto: UserChatRelationshipDTO) {
    return this.hubConnection.invoke('StoppedTyping', dto)
      .catch(err => console.error(err));
  }

  public onTypingSignal(callback: (userId: number, chatId: number) => void) {
    this.hubConnection.on('UserTypingAsync', (userId, chatId) => {callback(userId, chatId)})
  }

  public onStopTypingSignal(callback: (userId: number, chatId: number) => void) {
    this.hubConnection.on('UserStoppedTypingAsync', (userId, chatId) => {callback(userId, chatId)})
  }

  public onNewMessage(callback: (userId: number, chatId: number, value: boolean) => void) {
    this.hubConnection.on('GetMessagesInChatAsync', (userId, chatId, value) => {callback(userId, chatId, value)})
  }

  public stopSignalConnection() {
  if (this.hubConnection) {
    this.hubConnection.stop()
      .then(() => console.log('🔌 SignalR odpojeno'))
      .catch(err => console.error('Chyba při odpojení:', err));
  }
}


  public getMessagesInChat(userId: number, chatId: number): Observable<Message[]>{
    return this.http.get<Message[]>(`http://localhost:5000/api/Message/get-messages-in-chat-${userId}-${chatId}`)
  }

  public createMessage(message: Message): Observable<Message> {
    console.log('Creating message..')
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
