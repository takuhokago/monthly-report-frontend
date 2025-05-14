import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentSettingsComponent } from './department-settings.component';

describe('DepartmentSettingsComponent', () => {
  let component: DepartmentSettingsComponent;
  let fixture: ComponentFixture<DepartmentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DepartmentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
