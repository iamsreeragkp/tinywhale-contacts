import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LogInPageComponent } from './log-in-page.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SignUpPageComponent', () => {
  let component: LogInPageComponent;
  let fixture: ComponentFixture<LogInPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, NoopAnimationsModule, ReactiveFormsModule],
        declarations: [LogInPageComponent],
      }).compileComponents();

      fixture = TestBed.createComponent(LogInPageComponent);
      component = fixture.debugElement.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
