import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { EmployeeDto } from '../models/employee.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly API_URL = '/api/employees';
  private employeeCache: EmployeeDto[] = [];

  constructor(private http: HttpClient) {}

  // APIから取得＆キャッシュ登録
  getAll(): Observable<EmployeeDto[]> {
    return this.http
      .get<{ listSize: number; employeeList: EmployeeDto[] }>(this.API_URL, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.employeeList),
        tap((employees) => this.setCache(employees)) // ここでキャッシュに保存
      );
  }

  // 一覧キャッシュの setter
  setCache(employees: EmployeeDto[]): void {
    this.employeeCache = employees;
  }

  // キャッシュから取得
  getCachedEmployeeByCode(code: string): EmployeeDto | undefined {
    return this.employeeCache.find((e) => String(e.code) === code);
  }

  // キャッシュ優先で取得（なければAPI）
  getEmployeeByIdWithFallback(code: string): Observable<EmployeeDto> {
    const cached = this.getCachedEmployeeByCode(code);
    return cached
      ? of(cached)
      : this.http.get<EmployeeDto>(`${this.API_URL}/${code}`, {
          withCredentials: true,
        });
  }

  update(code: string, request: Partial<EmployeeDto>): Observable<EmployeeDto> {
    return this.http.put<EmployeeDto>(`${this.API_URL}/${code}`, request, {
      withCredentials: true,
    });
  }

  getByCode(code: string): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`/api/employees/${code}`, {
      withCredentials: true,
    });
  }

  delete(code: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${code}`, {
      withCredentials: true,
    });
  }

  getCurrentUser(): Observable<EmployeeDto> {
    return this.http.get<EmployeeDto>(`${this.API_URL}/me`, {
      withCredentials: true,
    });
  }
}
