import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<AuthenticationResult> {
    return this.http.post<AuthenticationResult>('http://localhost:5034/api/Authentication', user).pipe(
      tap(result => this.setToken(result.token))
    );
  }

  public setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }
}


class AuthenticationResult {
  public token: string;
}