import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ReportDto } from '../../models/report.dto';
import { ReportService } from '../../services/report.service';
import { AuthService } from '../../../auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './report-table.component.html',
})
export class ReportTableComponent implements OnInit, AfterViewInit {
  @Input() filterByUser = false;

  dataSource = new MatTableDataSource<ReportDto>();
  displayedColumns: string[] = [
    'reportMonth',
    'reportDeadline',
    'submittedAt',
    'completeFlg',
    'approvalFlg',
    'comment',
    'actions',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    this.reportService.getReports().subscribe((response) => {
      let reports = response.reportList;

      if (this.filterByUser && currentUser) {
        reports = reports.filter(
          (r) => String(r.employeeCode) === currentUser.code
        );
      }

      reports.sort((a, b) => b.reportMonth.localeCompare(a.reportMonth));

      this.dataSource.data = reports;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
}
