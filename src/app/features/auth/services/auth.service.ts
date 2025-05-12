import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoginRequest } from '../models/login-request.dto';
import { LoginResponse } from '../models/login-response.dto';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.API_URL, credentials, {
      withCredentials: true,
    });
  }

  logout(): Observable<any> {
    return this.http.post(
      'http://localhost:8080/api/auth/logout',
      {},
      {
        withCredentials: true,
        responseType: 'text',
      }
    );
  }

  isLoggedIn(): Observable<boolean> {
    return this.http
      .get('http://localhost:8080/api/auth/me', {
        withCredentials: true,
      })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }
}
