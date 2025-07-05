import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveConfirmDialogComponent } from './approve-confirm-dialog.component';

describe('ApproveConfirmDialogComponent', () => {
  let component: ApproveConfirmDialogComponent;
  let fixture: ComponentFixture<ApproveConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveConfirmDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApproveConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
