import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { Observable, map } from 'rxjs';
import { ReportDto } from '../../models/report.dto';

@Component({
  standalone: true,
  selector: 'app-report-detail',
  imports: [CommonModule],
  templateUrl: './report-detail.component.html',
})
export class ReportDetailComponent {
  private route = inject(ActivatedRoute);
  private reportService = inject(ReportService);

  report$: Observable<ReportDto>;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.report$ = this.reportService.getReportByIdWithFallback(id).pipe(
      map((res) => res.report) // 🔁 ReportDto を抽出
    );
  }
}
