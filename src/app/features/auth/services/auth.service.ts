import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { LoginRequest } from '../models/login-request.dto';
import { LoginResponse } from '../models/login-response.dto';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment'; // ← 相対パスに修正

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_BASE = `${environment.apiBaseUrl}/auth`;

  private currentUser: LoginResponse | null = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_BASE}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          this.currentUser = response;
          localStorage.setItem('currentUser', JSON.stringify(response));
          return response;
        })
      );
  }

  logout(): Observable<any> {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    return this.http.post(
      `${this.API_BASE}/logout`,
      {},
      {
        withCredentials: true,
        responseType: 'text',
      }
    );
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUser;
  }

  isLoggedIn(): Observable<boolean> {
    return this.http
      .get(`${this.API_BASE}/me`, {
        withCredentials: true,
      })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  isAdmin(): boolean {
    const role = this.currentUser?.role;
    return role === '管理者' || role === 'ADMIN';
  }
}
