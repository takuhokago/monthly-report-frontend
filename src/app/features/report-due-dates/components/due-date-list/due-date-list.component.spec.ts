import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDateListComponent } from './due-date-list.component';

describe('DueDateListComponent', () => {
  let component: DueDateListComponent;
  let fixture: ComponentFixture<DueDateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DueDateListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DueDateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
