import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../models/report.dto';
import { ReportCreateRequest } from '../../models/report.dto';

@Component({
  standalone: true,
  selector: 'app-report-new',
  imports: [CommonModule, FormsModule],
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
  employeeCode: '', // ログインユーザーから取得する
  employeeName: '',
  departmentName: '',
};

  constructor(
    private reportService: ReportService,
    private router: Router
  ) {}

  onSubmit(): void {
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
