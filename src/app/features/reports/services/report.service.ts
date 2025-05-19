import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ReportCreateRequest,
  ReportDto,
  ReportListResponse,
  ReportResponse,
} from '../models/report.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly API_URL = `${environment.apiBaseUrl}/reports`;
  private reportCache: ReportDto[] = [];

  constructor(private http: HttpClient) {}

  getReports(): Observable<ReportListResponse> {
    return this.http.get<ReportListResponse>(this.API_URL, {
      withCredentials: true,
    });
  }

  createReport(report: ReportCreateRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(this.API_URL, report, {
      withCredentials: true,
    });
  }

  setCache(reports: ReportDto[]): void {
    this.reportCache = reports;
  }

  getCachedReportById(id: string): ReportDto | undefined {
    return this.reportCache.find((r) => r.id === Number(id));
  }

  getReportById(id: string, forceReload = false): Observable<ReportResponse> {
    const cached = this.getCachedReportById(id);
    if (!forceReload && cached) {
      return of({ report: cached });
    }

    return this.http.get<ReportResponse>(`${this.API_URL}/${id}`, {
      withCredentials: true,
    });
  }

  updateReport(id: string, report: ReportDto): Observable<ReportResponse> {
    return this.http.put<ReportResponse>(`${this.API_URL}/${id}`, report, {
      withCredentials: true,
    });
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      withCredentials: true,
    });
  }

  approveReport(id: number, approve: boolean): Observable<ReportResponse> {
    return this.http.patch<ReportResponse>(
      `${this.API_URL}/${id}/approval?approve=${approve}`,
      null,
      { withCredentials: true }
    );
  }

  commentOnReport(id: number, comment: string): Observable<void> {
    return this.http.patch<void>(
      `${this.API_URL}/${id}/comment`,
      { comment },
      { withCredentials: true }
    );
  }
}
