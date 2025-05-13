import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, tap} from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {}

  public login(credentials: Credentials): Observable<AuthenticationResult> {
    return this.http.post<AuthenticationResult>('http://localhost:5000/api/Authentication/login', credentials).pipe(
      tap(result => this.setToken(result.token))
    );
  }

  public logout(): void {
    sessionStorage.removeItem('token');
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    try {
      return sessionStorage?.getItem('token') ?? null;
    } catch {
      return null;
    }
  }

  public setToken(token: string): void {
    sessionStorage.setItem('token', token);
  }

  public getUserIdFromToken(): number | null{
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<jwtPayload>(token);
      return decoded.id || null
    } catch(e) {
      console.error('Unable to decode token', e);
      return null;
    }
  }
}


class AuthenticationResult {
  public token: string;
}

class Credentials {
  public username: string;
  public password: string;
}

class jwtPayload {
  id?: number;
}
