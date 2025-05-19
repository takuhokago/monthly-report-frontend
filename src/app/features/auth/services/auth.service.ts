import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, catchError, switchMap } from 'rxjs';
import { LoginRequest } from '../models/login-request.dto';
import { environment } from '../../../../environments/environment';

export interface UserInfo {
  code: string;
  name: string;
  role: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_BASE = `${environment.apiBaseUrl}/auth`;

  private currentUser: UserInfo | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<UserInfo> {
    return this.http
      .post(`${this.API_BASE}/login`, credentials, { withCredentials: true })
      .pipe(
        // login後に/meを呼ぶことでユーザー情報を取得
        switchMap(() => this.fetchMe())
      );
  }

  fetchMe(): Observable<UserInfo> {
    return this.http
      .get<UserInfo>(`${this.API_BASE}/me`, { withCredentials: true })
      .pipe(
        tap((user) => (this.currentUser = user)),
        catchError((err) => {
          this.currentUser = null;
          return of(null as any);
        })
      );
  }

  logout(): Observable<any> {
    this.currentUser = null;
    return this.http.post(
      `${this.API_BASE}/logout`,
      {},
      {
        withCredentials: true,
        responseType: 'text',
      }
    );
  }

  getCurrentUser(): UserInfo | null {
    return this.currentUser;
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${this.API_BASE}/me`, { withCredentials: true }).pipe(
      tap(() => (this.currentUser = this.currentUser)), // 更新は省略
      map(() => true),
      catchError(() => of(false))
    );
  }

  isAdmin(): boolean {
    return (
      this.currentUser?.role === '管理者' || this.currentUser?.role === 'ADMIN'
    );
  }
}
