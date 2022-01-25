import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultBookingComponentComponent } from './no-result-booking-component.component';

describe('NoResultBookingComponentComponent', () => {
  let component: NoResultBookingComponentComponent;
  let fixture: ComponentFixture<NoResultBookingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoResultBookingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultBookingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
