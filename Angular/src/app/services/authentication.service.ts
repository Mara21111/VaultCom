import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  public login(credentials: Credentials): Observable<AuthenticationResult> {
    return this.http.post<AuthenticationResult>('http://localhost:5034/api/Authentication', credentials).pipe(
      tap(result => this.setToken(result.token))
    );
  }

  public logout(): void {
    sessionStorage.removeItem('token');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getToken(): string|null {
    return sessionStorage.getItem('token');
  }

  public setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }
}


class AuthenticationResult {
  public token: string;
}

class Credentials {
  public username: string;
  public password: string;
}