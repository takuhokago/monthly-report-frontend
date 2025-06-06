import { Component, OnInit } from '@angular/core';
import { ReportDto } from '../../models/report.dto';
import { ReportService } from '../../services/report.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { SelectComponent } from '../../../../shared/select/select.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { ExcelDownloadService } from '../../services/excel-download.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ButtonComponent,
    SelectComponent,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent implements OnInit {
  reports: ReportDto[] = [];
  reportMonthList: string[] = [];
  loading: boolean = true;
  selectedMonth: string = '';
  useLatest = false;
  displayedColumns: string[] = [
    'select',
    'employeeName',
    'reportMonth',
    'reportDeadline',
    'submittedAt',
    'departmentName',
    'completeFlg',
    'approvalFlg',
    'comment',
    'actions',
  ];
  @ViewChild(MatSort) sort!: MatSort;
  selectedReports: Set<number> = new Set();

  dataSource = new MatTableDataSource<ReportDto>(this.filteredReports);

  constructor(
    private reportService: ReportService,
    private excelDownloadService: ExcelDownloadService
  ) {}

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
        this.updateTableData();
        this.loading = false; // ローディング完了
      },
      error: (err) => {
        console.error('取得失敗', err);
        this.loading = false; // エラー時もローディング完了
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  updateTableData(): void {
    this.dataSource.data = this.filteredReports;

    // ソートを再度バインド（selectedMonth変更後にも必要）
    this.dataSource.sort = this.sort;
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

  isSelected(report: ReportDto): boolean {
    return this.selectedReports.has(report.id);
  }

  toggleSelection(report: ReportDto): void {
    if (this.isSelected(report)) {
      this.selectedReports.delete(report.id);
    } else {
      this.selectedReports.add(report.id);
    }
  }

  toggleAllSelection(checked: boolean): void {
    if (checked) {
      this.filteredReports.forEach((r) => this.selectedReports.add(r.id));
    } else {
      this.selectedReports.clear();
    }
  }

  isAllSelected(): boolean {
    return (
      this.filteredReports.length > 0 &&
      this.filteredReports.every((r) => this.selectedReports.has(r.id))
    );
  }

  isSomeSelected(): boolean {
    const selectedCount = this.filteredReports.filter((r) =>
      this.selectedReports.has(r.id)
    ).length;
    return selectedCount > 0 && selectedCount < this.filteredReports.length;
  }
  exportSelectedReports(): void {
    if (this.selectedReports.size === 0) {
      alert('少なくとも1件の報告書を選択してください。');
      return;
    }

    this.selectedReports.forEach((id) => {
      this.reportService.downloadReportExcel(id).subscribe((res) => {
        this.excelDownloadService.download(res, `report-${id}.xlsx`);
      });
    });
  }
}
