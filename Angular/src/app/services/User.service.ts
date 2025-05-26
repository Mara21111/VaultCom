import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {User, CreateUserDTO, UserGetterDTO, ToggleUserDTO, EditUserDTO} from '../models/User';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public constructor(private http: HttpClient, private authService: AuthenticationService) {

  }

  public createUser(createUser: CreateUserDTO): Observable<CreateUserDTO> {
    return this.http.post<CreateUserDTO>('http://localhost:5000/api/User/create-user', createUser);
  }

  public editUser(editUser: EditUserDTO): Observable<User> {
    return this.http.put<User>('http://localhost:5000/api/User/edit-user', editUser)
  }

  public toggleUserIsPublic(toggleUserDTO: ToggleUserDTO): Observable<User> {
    return this.http.put<User>('http://localhost:5000/api/User/toggle-user-is-public', toggleUserDTO);
  }

  public toggleUserSafeMode(toggleUserDTO: ToggleUserDTO): Observable<User> {
    return this.http.put<User>('http://localhost:5000/api/User/toggle-user-safe-mode', toggleUserDTO);
  }

  public deleteUser(deletingUserId: number, deletedUserId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5000/api/User/delete-user-${deletingUserId}-${deletedUserId}`)
  }

  public getAllUsersAdminView(): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>('http://localhost:5000/api/User/get-all-users-admin-view');
  }

  public getAllUsers(): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>('http://localhost:5000/api/User/get-all-users');
  }

  public getTimeOutedUsers(): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>('http://localhost:5000/api/User/get-timeouted-users');
  }

  public getGoodUsers(): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>('http://localhost:5000/api/User/get-good-users');
  }

  public getOnlineUsers(): Observable<UserGetterDTO[]> {
    return this.http.get<UserGetterDTO[]>('http://localhost:5000/api/User/get-online-users');
  }

  public getUser(userId: number): Observable<UserGetterDTO> {
    return this.http.get<UserGetterDTO>(`http://localhost:5000/api/User/get-user-${userId}`);
  }

  public getSelfUser(userId: number): Observable<User> {
    return this.http.get<User>(`http://localhost:5000/api/User/get-self-user-${userId}`);
  }

  public getFromToken(): Observable<User> {
    let id = this.authService.getUserIdFromToken() ?? 0;
    return this.getSelfUser(id);
  }
}
