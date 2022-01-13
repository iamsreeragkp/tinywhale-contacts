import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpPageComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule, ReactiveFormsModule],
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
