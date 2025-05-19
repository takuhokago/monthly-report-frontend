import { Component, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../models/report.dto';
import { ReportCreateRequest } from '../../models/report.dto';
import { AuthService } from '../../../auth/services/auth.service';
import { NgForm, NgModel } from '@angular/forms';
import { CharCountComponent } from '../../../../shared/char-count/char-count.component';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/button/button.component';
@Component({
  standalone: true,
  selector: 'app-report-new',
  imports: [CommonModule, FormsModule, CharCountComponent, RouterLink, ButtonComponent],
  templateUrl: './report-new.component.html',
})
export class ReportNewComponent {
  report: ReportCreateRequest = {
    reportMonth: '',
    contentBusiness: '',
    timeWorked: 0,
    timeOver: 0,
    rateBusiness: 0,
    rateStudy: 0,
    trendBusiness: 0,
    contentMember: '',
    contentCustomer: '',
    contentProblem: '',
    evaluationBusiness: '',
    evaluationStudy: '',
    goalBusiness: '',
    goalStudy: '',
    contentCompany: '',
    contentOthers: '',
    completeFlg: false,
    employeeCode: '',
    employeeName: '',
    departmentName: '',
  };

  @ViewChildren('fieldRef') fields!: QueryList<ElementRef>;

  constructor(
    private reportService: ReportService,
    private router: Router,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.report.employeeCode = user.code;
      this.report.employeeName = user.name;
      this.report.departmentName = user.department;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      // バリデーション表示
      Object.values(form.controls).forEach((control) =>
        control.markAsTouched()
      );

      // 最初のエラー要素にスクロール
      setTimeout(() => {
        const firstInvalid = this.fields.find((el, index) => {
          const controlName = Object.keys(form.controls)[index];
          return form.controls[controlName]?.invalid;
        });
        if (firstInvalid) {
          firstInvalid.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          firstInvalid.nativeElement.focus();
        }
      }, 0);

      return;
    }

    // フォームが有効な場合は登録処理
    this.reportService.createReport(this.report).subscribe({
      next: (res) => {
        console.log('登録成功:', res);
        this.router.navigate(['/reports']);
      },
      error: (err) => {
        console.error('登録失敗:', err);
        alert('登録に失敗しました。');
      },
    });
  }
}
