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
  private readonly API_URL = '/api/auth/login';

  private currentUser: LoginResponse | null = null;

  constructor(private http: HttpClient) {
    // ★ ローカルストレージから復元
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.API_URL, credentials, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          this.currentUser = response;
          localStorage.setItem('currentUser', JSON.stringify(response)); // ★ 保存
          return response;
        })
      );
  }

  logout(): Observable<any> {
    this.currentUser = null;
    localStorage.removeItem('currentUser'); // ★ 削除
    return this.http.post(
      '/api/auth/logout',
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
      .get('/api/auth/me', {
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
