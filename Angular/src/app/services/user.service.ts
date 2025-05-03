import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public constructor(private http: HttpClient, private authService: AuthenticationService) {}

  public createUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:5000/api/User/create-user', user);
  }

  public getAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/all-users');
  }

  public getById(id: number): Observable<User>{
    return this.http.get<User>('http://localhost:5000/api/User/user' + id);
  }

  public getFromToken(): Observable<User>{
    let id = this.authService.getUserIdFromToken() ?? 0;

    return this.getById(id);
  }

  public editUser(user: User): Observable<User>{
    return this.http.put<User>('http://localhost:5000/api/User/edit-user-' + user.id, user)
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
