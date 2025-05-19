import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharCountComponent } from './char-count.component';

describe('CharCountComponent', () => {
  let component: CharCountComponent;
  let fixture: ComponentFixture<CharCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CharCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
