import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public constructor(private http: HttpClient) {}

  public createUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:5000/api/User/create-user', user);
  }

  public getAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/User/all-users');
  }

  public getById(id: number): Observable<User>{
    return this.http.get<User>('http://localhost:5000/api/User/user-' + id);
  }

  public getNewUser(): User{
    let user = new User;
    user = new User;
    user.id = 0;
    user.email = '';
    user.phone_number = '';
    user.bio = '';
    user.status = 1;
    user.is_public = false;
    user.is_admin = false;
    user.created_at = new Date();
    user.private_key = '';
    user.public_key = '';
    user.timeout_end = new Date();
    user.ban_end = new Date();
    user.safe_mode = false;
    return user;
  }
}
