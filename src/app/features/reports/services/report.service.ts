import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ReportDto,
  ReportListResponse,
  ReportResponse,
} from '../models/report.dto';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly API_URL = 'http://localhost:8080/api/reports';
  private reportCache: ReportDto[] = [];

  constructor(private http: HttpClient) {}

  getReports(): Observable<ReportListResponse> {
    return this.http.get<ReportListResponse>(this.API_URL, {
      withCredentials: true,
    });
  }

  setCache(reports: ReportDto[]): void {
    this.reportCache = reports;
  }

  getCachedReportById(id: string): ReportDto | undefined {
    return this.reportCache.find((r) => r.id === Number(id));
  }

  getReportByIdWithFallback(id: string): Observable<ReportResponse> {
    const cached = this.getCachedReportById(id);
    return cached
      ? of({ report: cached })
      : this.http.get<ReportResponse>(`${this.API_URL}/${id}`, {
          withCredentials: true,
        });
  }
}
