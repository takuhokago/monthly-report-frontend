import type { ReportDto } from '../../app/features/reports/models/report.dto';
import { seedReports } from './seed/report.seed';

class ReportStore {
  reports: ReportDto[] = [];

  constructor() {
    this.reset();
  }
  reset() {
    this.reports = seedReports();
  }
  nextId() {
    return this.reports.length
      ? Math.max(...this.reports.map((r) => r.id)) + 1
      : 1;
  }
}
export const reportStore = new ReportStore();
