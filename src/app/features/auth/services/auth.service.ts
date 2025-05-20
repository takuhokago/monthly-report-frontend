import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { LoginRequest } from '../models/login-request.dto';
import { LoginResponse } from '../models/login-response.dto';
import { environment } from '../../../../environments/environment';
import { EmployeeDto } from '../../employees/models/employee.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_BASE = `${environment.apiBaseUrl}/auth`;

  private currentUser: EmployeeDto | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<EmployeeDto> {
    return this.http
      .post<LoginResponse>(`${this.API_BASE}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          // LoginResponse → EmployeeDto に変換して保持
          this.currentUser = {
            code: res.code,
            lastName: '', // name しかないので空にしておく
            firstName: '',
            fullName: res.name,
            email: res.email,
            role: res.role,
            departmentName: res.department,
          };
        }),
        map(() => this.currentUser as EmployeeDto)
      );
  }

  fetchMe(): Observable<EmployeeDto> {
    return this.http
      .get<EmployeeDto>(`${this.API_BASE}/me`, { withCredentials: true })
      .pipe(
        tap((user) => (this.currentUser = user)),
        catchError(() => {
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

  getCurrentUser(): EmployeeDto | null {
    return this.currentUser;
  }

  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${this.API_BASE}/me`, { withCredentials: true }).pipe(
      tap(() => {}),
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
