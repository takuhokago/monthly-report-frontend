import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DepartmentDto } from '../models/department.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private baseUrl = '/api/departments';

  constructor(private http: HttpClient) {}

  // 所属一覧取得
  getAll(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(this.baseUrl);
  }

  // 所属追加
  create(department: Partial<DepartmentDto>): Observable<DepartmentDto> {
    return this.http.post<DepartmentDto>(this.baseUrl, department);
  }

  // 所属削除
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
