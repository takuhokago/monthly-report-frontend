import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { ReportDto } from '../../models/report.dto';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../../auth/services/auth.service'; // ログインユーザー情報取得用
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './report-table.component.html',
})
export class ReportTableComponent implements OnInit {
  @Input() filterByUser = false;
  reports$: Observable<ReportDto[]> = new Observable();

  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    this.reports$ = this.reportService.getReports().pipe(
      map((response) => {
        let reports = response.reportList;
        if (this.filterByUser && currentUser) {
          reports = reports.filter(
            (r) => String(r.employeeCode) === currentUser.code
          );
        }
        return reports.sort((a, b) =>
          b.reportMonth.localeCompare(a.reportMonth)
        );
      })
    );
  }
}
