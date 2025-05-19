import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeDto } from '../../models/employee.dto';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
})
export class EmployeeDetailComponent implements OnInit {
  employee$!: Observable<EmployeeDto>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.employee$ = this.employeeService.getByCode(code);
    }
  }

  onDelete(code: string): void {
    const confirmDelete = confirm('この従業員を削除してもよろしいですか？');
    if (!confirmDelete) return;

    this.employeeService.delete(code).subscribe({
      next: () => {
        alert('削除に成功しました');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error('削除失敗:', err);
        const errorMessage = err.error?.message || '不明なエラーが発生しました';
        alert('削除に失敗しました: ' + errorMessage);
      },
    });
  }
}
