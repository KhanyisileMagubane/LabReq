import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestDataTableComponent } from './request-data-table.component';

describe('RequestDataTableComponent', () => {
  let component: RequestDataTableComponent;
  let fixture: ComponentFixture<RequestDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
