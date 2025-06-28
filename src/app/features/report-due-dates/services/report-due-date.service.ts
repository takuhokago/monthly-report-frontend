import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';
import { ReportDueDateDto } from '../models/report-due-date.dto';
import { environment } from '../../../../environments/environment';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportDueDateService {
  private readonly API_URL = `${environment.apiBaseUrl}/report-due-dates`;
  private dueDateCache: ReportDueDateDto[] = [];

  constructor(private http: HttpClient) {}

  /**
   * 一覧取得（+キャッシュ保存）
   */
  getAll(): Observable<ReportDueDateDto[]> {
    return this.http
      .get<any[]>(this.API_URL, {
        withCredentials: true,
      })
      .pipe(
        map((response) =>
          (response ?? []).map((item) => ({
            id: item.id,
            year: +item.yearmonth.split('-')[0],
            month: +item.yearmonth.split('-')[1],
            dueDateTime: item.dueDate,
          }))
        ),
        tap((dueDates) => this.setCache(dueDates))
      );
  }

  /**
   * キャッシュをセット
   */
  private setCache(dueDates: ReportDueDateDto[]): void {
    this.dueDateCache = dueDates;
  }

  /**
   * キャッシュから特定の年月を取得
   */
  getCached(year: number, month: number): ReportDueDateDto | undefined {
    return this.dueDateCache.find((d) => d.year === year && d.month === month);
  }

  /**
   * サーバー取得（キャッシュがなければ）
   */
  getWithFallback(year: number, month: number): Observable<ReportDueDateDto> {
    const cached = this.getCached(year, month);
    return cached
      ? of(cached)
      : this.http.get<ReportDueDateDto>(`${this.API_URL}/${year}/${month}`, {
          withCredentials: true,
        });
  }

  /**
   * 年単位で一括登録
   */
  registerYear(year: number): Observable<void> {
    return this.http
      .post<void>(
        `${this.API_URL}/yearly/${year}`,
        {},
        { withCredentials: true }
      )
      .pipe(
        catchError((error) => {
          // 呼び出し元でステータスコードを使って処理できるようエラーをそのまま流す
          return throwError(() => error);
        })
      );
  }

  /**
   * 年単位で一括削除
   */
  deleteYear(year: number): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/yearly/${year}`, {
        withCredentials: true,
      })
      .pipe(catchError((error) => throwError(() => error)));
  }

  /**
   * 提出期日を一括更新（存在する年月のみ対象。存在しない場合はAPI側で400エラー）
   */
  updateAll(dueDates: ReportDueDateDto[]): Observable<ReportDueDateDto[]> {
    const requestBody = dueDates.map((dto) => ({
      yearmonth: `${dto.year.toString().padStart(4, '0')}-${dto.month
        .toString()
        .padStart(2, '0')}`,
      dueDate: dto.dueDateTime,
    }));

    return this.http
      .put<
        {
          id: number;
          yearmonth: string;
          dueDate: string;
        }[]
      >(this.API_URL, requestBody, {
        withCredentials: true,
      })
      .pipe(
        map((response) =>
          (response ?? []).map((item) => ({
            id: item.id,
            year: +item.yearmonth.split('-')[0],
            month: +item.yearmonth.split('-')[1],
            dueDateTime: item.dueDate,
          }))
        ),
        tap((updatedList) => this.setCache(updatedList)),
        catchError((error) => {
          console.error('更新エラー:', error);
          return throwError(() => error);
        })
      );
  }
}
