import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportEditComponent } from './report-edit.component';

describe('ReportEditComponent', () => {
  let component: ReportEditComponent;
  let fixture: ComponentFixture<ReportEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
