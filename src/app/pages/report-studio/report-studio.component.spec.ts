import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStudioComponent } from './report-studio.component';

describe('ReportStudioComponent', () => {
  let component: ReportStudioComponent;
  let fixture: ComponentFixture<ReportStudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportStudioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReportStudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
