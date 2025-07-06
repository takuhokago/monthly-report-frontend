import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { ReportDto } from '../../models/report.dto';
import { CharCountComponent } from '../../../../shared/char-count/char-count.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { NgForm } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-report-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CharCountComponent,
    RouterLink,
    ButtonComponent,
    TextFieldModule,
    MatInputModule,
  ],
  templateUrl: './report-edit.component.html',
})
export class ReportEditComponent implements OnInit {
  reportId!: string;
  report: ReportDto = {} as ReportDto;
  timeWorkedHour: number = 0;
  timeWorkedMinute: number = 0;
  timeOverHour: number = 0;
  timeOverMinute: number = 0;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reportId = this.route.snapshot.paramMap.get('id')!;
    this.reportService.getReportById(this.reportId, true).subscribe({
      next: (res) => {
        this.report = res.report;

        // 既存の値（分）→ 時間＋分 に変換
        this.timeWorkedHour = Math.floor(this.report.timeWorked / 60);
        this.timeWorkedMinute = this.report.timeWorked % 60;
        this.timeOverHour = Math.floor(this.report.timeOver / 60);
        this.timeOverMinute = this.report.timeOver % 60;
      },
      error: (err) => {
        console.error('取得失敗:', err);
      },
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    // 分単位に変換して本体に代入
    this.report.timeWorked = this.timeWorkedHour * 60 + this.timeWorkedMinute;
    this.report.timeOver = this.timeOverHour * 60 + this.timeOverMinute;

    this.reportService.updateReport(this.reportId, this.report).subscribe({
      next: (res) => {
        alert('報告書を更新しました');
        this.router.navigate(['/reports', this.reportId]);
      },
      error: (err) => {
        console.error('更新に失敗しました:', err);
        alert('報告書の更新に失敗しました');
      },
    });
  }
}
