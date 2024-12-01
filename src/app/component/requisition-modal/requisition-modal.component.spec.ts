import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionModalComponent } from './requisition-modal.component';

describe('RequisitionModalComponent', () => {
  let component: RequisitionModalComponent;
  let fixture: ComponentFixture<RequisitionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisitionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequisitionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
