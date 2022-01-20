import { Component, ViewChild } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { RoutesConfig } from '../../../../configs/routes.config';
import { Router } from '@angular/router';
import { UtilsService } from '../../../../shared/services/utils.service';
import { StorageService } from 'src/app/shared/services/storage.service';
import { IAuthState } from '../../store/auth.reducers';
import { Store } from '@ngrx/store';
import { logIn } from '../../store/auth.actions';
import { Type } from '../../store/auth.interface';

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
export class LogInPageComponent {
  // @ViewChild('loginForm') loginForm: any;

  logInForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private store: Store<IAuthState>
  ) {
    this.logInForm = this.createLoginForm();
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
}
