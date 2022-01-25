import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDataBookingComponentComponent } from './no-data-booking-component.component';

describe('NoDataBookingComponentComponent', () => {
  let component: NoDataBookingComponentComponent;
  let fixture: ComponentFixture<NoDataBookingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDataBookingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoDataBookingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
