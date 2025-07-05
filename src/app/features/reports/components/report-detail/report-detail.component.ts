import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { Observable, map } from 'rxjs';
import { ReportDto } from '../../models/report.dto';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharCountComponent } from '../../../../shared/char-count/char-count.component';
import { ButtonComponent } from '../../../../shared/button/button.component';
import { AuthService } from '../../../auth/services/auth.service';
import { ExcelDownloadService } from '../../services/excel-download.service';

@Component({
  standalone: true,
  selector: 'app-report-detail',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CharCountComponent,
    ButtonComponent,
  ],
  templateUrl: './report-detail.component.html',
})
export class ReportDetailComponent {
  report$!: Observable<ReportDto>;

  isCommentFormVisible = false;
  commentText = '';
  timeWorkedHour: number = 0;
  timeWorkedMinute: number = 0;
  timeOverHour: number = 0;
  timeOverMinute: number = 0;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private router: Router,
    private authService: AuthService,
    private excelDownloadService: ExcelDownloadService
  ) {
    this.loadReport();
  }

  loadReport(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.report$ = this.reportService.getReportById(id, true).pipe(
      map((res) => {
        const report = res.report;

        // 分 → 時間＋分
        this.timeWorkedHour = Math.floor(report.timeWorked / 60);
        this.timeWorkedMinute = report.timeWorked % 60;
        this.timeOverHour = Math.floor(report.timeOver / 60);
        this.timeOverMinute = report.timeOver % 60;

        return report;
      })
    );
  }

  onDelete(id: number): void {
    if (confirm('この報告書を削除してもよろしいですか？')) {
      this.reportService.deleteReport(id).subscribe({
        next: () => this.router.navigate(['/reports']),
        error: (err) => {
          console.error('削除エラー:', err);
          alert('削除に失敗しました');
        },
      });
    }
  }

  onApprove(id: number): void {
    const result = window.confirm(
      'この報告書を承認しますか？\n\n[OK]で承認\n[キャンセル]で非承認'
    );
    const approve = result;

    this.reportService.approveReport(id, approve).subscribe({
      next: () => {
        alert(approve ? '承認しました。' : '非承認にしました。');
        this.loadReport(); // ← 成功時に追加
        // 必要に応じてデータを再取得したり画面更新したりする処理をここに
      },
      error: (err) => {
        console.error('承認処理に失敗しました:', err);
        alert('承認処理に失敗しました。');
      },
    });
  }

  onSubmitComment(id: number): void {
    if (!this.commentText.trim()) {
      alert('コメントを入力してください。');
      return;
    }

    this.reportService.commentOnReport(id, this.commentText).subscribe({
      next: () => {
        alert('コメントを追加しました。');
        this.commentText = '';
        this.isCommentFormVisible = false;
        this.loadReport(); // 再取得して最新のコメントを反映
      },
      error: (err) => {
        console.error('コメント送信失敗:', err);
        alert('コメントの送信に失敗しました。');
      },
    });
  }

  toggleCommentForm(initialComment: string | null): void {
    this.isCommentFormVisible = !this.isCommentFormVisible;

    if (this.isCommentFormVisible) {
      this.commentText = initialComment || '';
    }
  }

  onExportExcel(reportId: number): void {
    this.reportService.downloadReportExcel(reportId).subscribe((res) => {
      this.excelDownloadService.download(res, `report-${reportId}.xlsx`);
    });
  }

  isMine(report: ReportDto): boolean {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;

    // 現在のユーザーが報告書の作成者かどうか
    return report.employeeName === currentUser.name;
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  formatDate(input: string, mode: 'month' | 'date' | 'datetime'): string {
    if (!input) return '';
    const date = new Date(input);
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    const hh = ('0' + date.getHours()).slice(-2);
    const mm = ('0' + date.getMinutes()).slice(-2);

    switch (mode) {
      case 'month':
        return `${y}/${m}`;
      case 'date':
        return `${m}/${d}`;
      case 'datetime':
        return `${y}/${m}/${d} ${hh}:${mm}`;
      default:
        return '';
    }
  }
}
