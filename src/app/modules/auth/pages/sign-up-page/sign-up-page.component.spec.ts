import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpPageComponent } from './sign-up-page.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpPageComponent', () => {
  let component: SignUpPageComponent;
  let fixture: ComponentFixture<SignUpPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule, ReactiveFormsModule],
        declarations: [SignUpPageComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(SignUpPageComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
