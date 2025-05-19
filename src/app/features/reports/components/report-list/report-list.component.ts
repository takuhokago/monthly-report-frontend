import { Component, OnInit } from '@angular/core';
import { ReportDto } from '../../models/report.dto';
import { ReportService } from '../../services/report.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { SelectComponent } from '../../../../shared/select/select.component';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonComponent,
    SelectComponent,
  ],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit {
  reports: ReportDto[] = [];
  reportMonthList: string[] = [];
  selectedMonth: string = '';
  loading: boolean = true;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getReports().subscribe({
      next: (res) => {
        this.reports = res.reportList;

        // 🔽 ここでキャッシュに保存
        this.reportService.setCache(res.reportList);

        // ユニークなreportMonthを抽出して降順にソート
        this.reportMonthList = [
          ...new Set(this.reports.map((r) => r.reportMonth)),
        ]
          .sort()
          .reverse();
        this.selectedMonth = this.reportMonthList[0]; // 最新の月を初期選択
        this.loading = false; // ローディング完了
      },
      error: (err) => {
        console.error('取得失敗', err);
        this.loading = false; // エラー時もローディング完了
      },
    });
  }

  get filteredReports(): ReportDto[] {
    return this.reports.filter((r) => r.reportMonth === this.selectedMonth);
  }

  formatDate(input: string, mode: 'month' | 'date'): string {
    if (!input) return '';
    const date = new Date(input + (mode === 'month' ? '-01' : ''));
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    return mode === 'month' ? `${y}/${m}` : `${y}/${m}/${d}`;
  }

  hasValue(str?: string | null): boolean {
    return !!str && str.trim().length > 0;
  }
}
