import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorReportComponent } from './constructor-report.component';

describe('ConstructorReportComponent', () => {
  let component: ConstructorReportComponent;
  let fixture: ComponentFixture<ConstructorReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructorReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConstructorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
