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
  private route = inject(ActivatedRoute);
  private reportService = inject(ReportService);
  private router = inject(Router);

  report$!: Observable<ReportDto>;

  isCommentFormVisible = false;
  commentText = '';

  constructor() {
    this.loadReport();
  }

  loadReport(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.report$ = this.reportService
      .getReportById(id, true) // ← ここでキャッシュを無視
      .pipe(map((res) => res.report));
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
      const blob = res.body!;
      const contentDisposition = res.headers.get('Content-Disposition');
      const filename =
        this.extractFilename(contentDisposition) || 'report.xlsx';

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  private extractFilename(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;

    const filenameRegex = /filename\*?=(?:UTF-8''|")(.*?)(?:\"|$)/;
    const match = filenameRegex.exec(contentDisposition);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
    return null;
  }
}
