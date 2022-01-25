import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableBookingComponentComponent } from './table-booking-component.component';

describe('TableBookingComponentComponent', () => {
  let component: TableBookingComponentComponent;
  let fixture: ComponentFixture<TableBookingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableBookingComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableBookingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
