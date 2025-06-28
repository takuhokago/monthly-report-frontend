import { TestBed } from '@angular/core/testing';

import { ReportDueDateService } from './report-due-date.service';

describe('ReportDueDateService', () => {
  let service: ReportDueDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportDueDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
