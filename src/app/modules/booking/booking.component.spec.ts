import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BookingComponent } from './booking.component';

describe('AuthComponent', () => {
  let component: BookingComponent;
  let fixture: ComponentFixture<BookingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule],
        declarations: [BookingComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(BookingComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
