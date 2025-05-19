import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../../departments/services/department.service';
import { DepartmentDto } from '../../../departments/models/department.dto';
import { EmployeeDto, EmployeeRequest } from '../../models/employee.dto';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-edit.component.html',
})
export class EmployeeEditComponent implements OnInit {
  @Input() selfMode = false;
  isAdmin = false;

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
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.fetchDepartments();

    if (this.selfMode) {
      this.employeeService.getCurrentUser().subscribe({
        next: (user) => {
          this.employee = {
            ...user,
            role: this.convertRoleToEnum(user.role),
            password: '',
          };
          this.isAdmin = this.employee.role === 'ADMIN';
          console.log(
            '取得したrole:',
            user.role,
            '変換後:',
            this.employee.role
          );
        },

        error: (err) =>
          console.error('ログインユーザー情報の取得に失敗しました', err),
      });
    } else {
      const code = this.route.snapshot.paramMap.get('code');
      if (code) {
        this.employeeService.getEmployeeByIdWithFallback(code).subscribe({
          next: (employee) => {
            this.employee = {
              ...employee,
              role: this.convertRoleToEnum(employee.role),
              password: '',
            };
          },

          error: (err) =>
            console.error('従業員データの取得に失敗しました', err),
        });
      }
    }
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

    const updateData: EmployeeRequest = {
      ...this.employee,
    };
    console.log('送信データ:', updateData);


    this.employeeService.update(this.employee.code, updateData).subscribe({
      next: () => {
        alert('従業員情報を更新しました');
        const redirectUrl = this.selfMode ? '/profile' : '/employees';
        this.router.navigate([redirectUrl]);
      },
      error: (err) => {
        console.error('更新に失敗しました', err);
        alert('更新に失敗しました');
      },
    });
  }

  private convertRoleToEnum(role: string): 'GENERAL' | 'ADMIN' {
    if (role === 'ADMIN' || role === 'GENERAL')
      return role as 'GENERAL' | 'ADMIN';
    return role === '管理者' ? 'ADMIN' : 'GENERAL';
  }
}
