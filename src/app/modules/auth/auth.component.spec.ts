import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule],
        declarations: [AuthComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(AuthComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
