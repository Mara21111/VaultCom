import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';
import { CreateGroupChatDTO, EditGroupChatDTO } from '../models/GroupChat';

@Injectable({
  providedIn: 'root'
})
export class GroupChatService {
  constructor(private http: HttpClient) {

  }

  public createGroupChat(CreatedGroupChat: CreateGroupChatDTO): Observable<void>{
    return this.http.post<void>('http://localhost:5000/api/GroupChat/create-group-chat', CreatedGroupChat)
  }

  public editGroupChat(edit: EditGroupChatDTO): Observable<EditGroupChatDTO> {
    return this.http.put<EditGroupChatDTO>('http://localhost:5000/api/GroupChat/edit-group-chat', edit);
  }

  public deleteGroupChat(userId: number, chatId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5000/api/GroupChat/delete-group-chat-${userId}-${chatId}`);
  }
}
