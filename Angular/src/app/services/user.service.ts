import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, CreateUserDTO, EditUserDTO } from '../models/User';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public constructor(private http: HttpClient, private authService: AuthenticationService) {}

  public createUser(createUser: CreateUserDTO): Observable<CreateUserDTO> {
    return this.http.post<CreateUserDTO>('http://localhost:5000/api/User/create-user', createUser);
  }

  public editUser(editUser: User): Observable<User>{
    return this.http.put<User>('http://localhost:5000/api/User/edit-user', editUser)
  }

  public deleteUser(deletingUserId: number, deletedUserId: number): Observable<void> {
    return this.http.delete<void>('http://localhost:5000/api/User/delete-user' + deletingUserId + '-' + deletedUserId)
  }

  public getAllUsersAdminView(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-all-users-admin-view');
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-all-users');
  }

  public getTimeoutedUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-timeouted-users');
  }

  public getGoodUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-good-users');
  }

  public getOnlineUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/get-online-users');
  }

  public getUser(user_id: number): Observable<User> {
    return this.http.get<User>('http://localhost:5000/api/User/get-user-' + user_id);
  }

  public getSelfUser(requestor_id: number, sender_id: number): Observable<User>{
    return this.http.get<User>('http://localhost:5000/api/User/get-self-user-' + requestor_id + '-' + sender_id);
  }

  public getFromToken(): Observable<User>{
    let id= this.authService.getUserIdFromToken() ?? 0;
    console.log('get from token ' + id);
    return this.getSelfUser(id, id);
  }



  public getNewUser(): User{
    let user = new User;
    user = new User;
    user.id = 0;
    user.email = '';
    user.phone_Number = '';
    user.bio = '';
    user.status = 1;
    user.is_Public = false;
    user.is_Admin = false;
    user.created_At = new Date();
    user.private_key = '';
    user.public_key = '';
    user.timeout_End = new Date();
    user.ban_End = new Date();
    user.safe_mode = false;
    return user;
  }
}
