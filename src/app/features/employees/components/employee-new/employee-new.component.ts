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

  passwordStrength = '';
  passwordStrengthClass = '';

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

  checkPasswordStrength(password: string): void {
    // パスワード強度の判定
    // 強: 大文字・小文字・数字すべて含む & 長さ12〜16文字
    // 普通: 文字種が3つ未満で2つ以上含む & 長さ8〜16文字
    // 弱: 上記以外（8〜16文字）
    // 表示なし: 8文字未満 or 16文字超

    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);

    const typesCount = [hasUpper, hasLower, hasDigit].filter(Boolean).length;

    if (length >= 8 && length <= 16) {
      if (typesCount === 3 && length >= 12) {
        this.passwordStrength = '強力なパスワードです';
        this.passwordStrengthClass = 'text-success';
      } else if (typesCount >= 2) {
        this.passwordStrength = '普通のパスワードです';
        this.passwordStrengthClass = 'text-warning';
      } else {
        this.passwordStrength = '弱いパスワードです';
        this.passwordStrengthClass = 'text-danger';
      }
    } else {
      this.passwordStrength = '';
      this.passwordStrengthClass = '';
    }
  }
}
