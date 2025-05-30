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
import { EmployeeService } from '../../../employees/services/employee.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  standalone: true,
  selector: 'app-report-new',
  imports: [
    CommonModule,
    FormsModule,
    CharCountComponent,
    RouterLink,
    ButtonComponent,
  ],
  templateUrl: './report-new.component.html',
})
export class ReportNewComponent {
  useLatest: boolean = false;
  timeWorkedHour: number = 0;
  timeWorkedMinute: number = 0;
  timeOverHour: number = 0;
  timeOverMinute: number = 0;

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
    contentProblem: '【問題点】\n【解決策】\n【ヒヤリハット】',
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
    private authService: AuthService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const useLatestParam = this.route.snapshot.queryParamMap.get('useLatest');
    this.useLatest = useLatestParam === 'true';

    const user = this.authService.getCurrentUser();
    if (user) {
      this.report.employeeCode = user.code;

      this.employeeService.getByCode(user.code).subscribe({
        next: (employee) => {
          this.report.employeeName = employee.fullName ?? '';
          this.report.departmentName = employee.departmentName ?? '';

          if (this.useLatest) {
            this.loadLatestReport();
          }
        },
        error: (err) => {
          console.error('社員情報の取得に失敗しました', err);
        },
      });
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

    // 分単位に変換して本体に代入
    this.report.timeWorked = this.timeWorkedHour * 60 + this.timeWorkedMinute;
    this.report.timeOver = this.timeOverHour * 60 + this.timeOverMinute;

    // フォームが有効な場合は登録処理
    this.reportService.createReport(this.report).subscribe({
      next: (res) => {
        console.log('登録成功:', res);
        this.router.navigate(['/reports']);
      },
      error: (err) => {
        console.error('登録失敗:', err);

        // サーバーからのエラーメッセージがある場合は表示
        const message =
          err?.error?.message ?? '登録に失敗しました。もう一度お試しください。';

        alert(message);
      },
    });
  }

  private loadLatestReport(): void {
    this.reportService.getLatestReport().subscribe({
      next: (latest: ReportDto) => {
        if (latest) {
          const {
            reportMonth,
            contentBusiness,
            timeWorked,
            timeOver,
            rateBusiness,
            rateStudy,
            trendBusiness,
            contentMember,
            contentCustomer,
            contentProblem,
            evaluationBusiness,
            evaluationStudy,
            goalBusiness,
            goalStudy,
            contentCompany,
            contentOthers,
          } = latest;

          Object.assign(this.report, {
            reportMonth,
            contentBusiness,
            timeWorked,
            timeOver,
            rateBusiness,
            rateStudy,
            trendBusiness,
            contentMember,
            contentCustomer,
            contentProblem,
            evaluationBusiness,
            evaluationStudy,
            goalBusiness,
            goalStudy,
            contentCompany,
            contentOthers,
          });

          // 既存の値（分）→ 時間＋分 に変換
          this.timeWorkedHour = Math.floor(this.report.timeWorked / 60);
          this.timeWorkedMinute = this.report.timeWorked % 60;
          this.timeOverHour = Math.floor(this.report.timeOver / 60);
          this.timeOverMinute = this.report.timeOver % 60;
        }
      },
      error: (err) => {
        console.error('直近の報告書取得に失敗しました', err);
      },
    });
  }
}
