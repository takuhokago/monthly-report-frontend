// src/app/features/employees/services/employee.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EmployeeDto } from '../models/employee.dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = '/api/employees';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EmployeeDto[]> {
    return this.http
      .get<{ listSize: number; employeeList: EmployeeDto[] }>(this.apiUrl, {
        withCredentials: true,
      })
      .pipe(map((response) => response.employeeList));
  }
}
