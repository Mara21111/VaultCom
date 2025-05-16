import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, CreateUserDTO, EditUserDTO, UserToggleDTO } from '../models/User';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public constructor(private http: HttpClient, private authService: AuthenticationService) {

  }

  public CreateUser(createUser: CreateUserDTO): Observable<CreateUserDTO> {
    return this.http.post<CreateUserDTO>('http://localhost:5000/api/User/create-user', createUser);
  }

  public EditUser(editUser: User): Observable<User> {
    return this.http.put<User>('http://localhost:5000/api/User/edit-user', editUser)
  }

  public ToggleUserSettings(toggledSettings: EditUserDTO): Observable<User> {
    return this.http.put<User>('http://localhost:5000/api/User/toggle-user-setting', toggledSettings)
  }

  public DeleteUser(deletingUserId: number, deletedUserId: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/User/delete-user' + deletingUserId + '-' + deletedUserId)
  }

  public GetAllUsersAdminView(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-all-users-admin-view');
  }

  public GetAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-all-users');
  }

  public GetTimeoutedUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-timeouted-users');
  }

  public GetGoodUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-good-users');
  }

  public GetOnlineUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-online-users');
  }

  public GetUser(user_id: number): Observable<User> {
    return this.http.get<User>('http://localhost:5000/api/User/get-user-' + user_id);
  }

  public GetSelfUser(user_id: number): Observable<User> {
    return this.http.get<User>('http://localhost:5000/api/User/get-self-user-' + user_id);
  }

  public GetFromToken(): Observable<User> {
    let id = this.authService.getUserIdFromToken() ?? 0;
    console.log('get from token ' + id);
    return this.GetSelfUser(id);
  }
}
