import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { EmployeeRequest } from '../../models/employee.dto';
import { DepartmentService } from '../../../departments/services/department.service';
import { DepartmentDto } from '../../../departments/models/department.dto';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-employee-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-new.component.html',
})
export class EmployeeNewComponent {
  employee: EmployeeRequest = {
    code: '',
    lastName: '',
    firstName: '',
    email: '',
    role: 'GENERAL',
    departmentName: '',
    password: '',
  };

  roleOptions = [
    { label: '一般', value: 'GENERAL' },
    { label: '管理者', value: 'ADMIN' },
  ];

  departments: DepartmentDto[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.fetchDepartments();
  }

  fetchDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data) => (this.departments = data),
      error: (err) => console.error('所属一覧の取得に失敗しました', err),
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.http.post('/api/employees', this.employee).subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err) =>
        alert('登録に失敗しました: ' + (err.error?.message || err.statusText)),
    });
  }
}
