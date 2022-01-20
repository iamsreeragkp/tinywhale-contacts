import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { IAuthState } from '../../store/auth.reducers';
import { select, Store } from '@ngrx/store';
import { logIn, logInError } from '../../store/auth.actions';
import { Type } from '../../store/auth.interface';
import { filter, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { getLogInError } from '../../store/auth.selectors';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(
        '* => *',
        useAnimation(fadeIn, {
          params: { timing: 1, delay: 0 },
        })
      ),
    ]),
  ],
})
export class LogInPageComponent implements OnInit, OnDestroy {
  // @ViewChild('loginForm') loginForm: any;

  logInForm!: FormGroup;
  loginError$: Observable<string>;
  ngUnsubscribe = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<IAuthState>
  ) {
    this.logInForm = this.createLoginForm();
    this.loginError$ = this.store.pipe(select(getLogInError));
  }
  
  ngOnInit() {
    this.subscriptions();
  }

  subscriptions() {
    this.loginError$.pipe(takeUntil(this.ngUnsubscribe), filter(val => !!val)).subscribe(err => {
      this.logInForm.setErrors({ loginFail: err });
      this.store.dispatch(logInError({ error: undefined }));
      this.logInForm.valueChanges.pipe(take(1), tap(() => {
        this.logInForm.setErrors({ loginFail: null });
        this.logInForm.updateValueAndValidity();
      }));
    });
  }

  createLoginForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }

  onSubmitLogin() {
    const { email, password } = this.logInForm.value;
    const payload = {
      email,
      password,
    };
    this.store.dispatch(logIn({ user: payload }));
  }

  async onSubmitGoogleSignIn() {
    try {
      const data = await this.authService.googleSignIn();
      console.log(data);
      if (data && data?.response?.['access_token']) {
        const { email, idToken } = data;
        const payload = {
          email,
          idToken,
          type:Type.GOOGLE,
        };
        console.log('payload', payload);
        this.store.dispatch(logIn({ user: payload }));
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  navigateToSignUp() {
    this.router.navigateByUrl('/auth/sign-up');
  }

  get email() {
    return this.logInForm.get('email');
  }

  get password() {
    return this.logInForm.get('password');
  }
  
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
