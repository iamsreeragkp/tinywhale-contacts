import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { UtilsService } from '../../../../shared/services/utils.service';
import { RoutesConfig } from '../../../../configs/routes.config';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  skipWhile,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IAuthState } from '../../store/auth.reducers';
import { logIn, searchDomain, signUp } from '../../store/auth.actions';
import { getDomainData } from '../../store/auth.selectors';
import { AccountType, Type } from '../../store/auth.interface';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.scss'],
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
export class SignUpPageComponent implements OnInit, OnDestroy {
  signUpForm!: FormGroup;
  searchDomain: any;
  isDomainAvailable: boolean = false;

  search$ = new Subject<string>();
  ngUnsubscribe = new Subject<any>();
  isChecking = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private store: Store<IAuthState>
  ) {
    this.signUpForm = this.createSignupForm();
  }

  ngOnInit() {
    this.search$
      .pipe(
        tap(() => {
          (this.isChecking = true);
          this.domain?.markAsTouched();
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(val => {
        if (val) {
          this.store.dispatch(searchDomain({ searchDomain: val }));
        } else {
          this.isChecking = false;
          this.isDomainAvailable = false;
        }
      });
    this.store.pipe(select(getDomainData), takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.isChecking = false;
      if (data && data?.Availability === false) {
        this.isDomainAvailable = true;
      } else {
        this.isDomainAvailable = false;
      }
    });
  }

  createSignupForm() {
    return new FormGroup({
      domain: new FormControl('', [Validators.required, Validators.minLength(1)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
    });
  }

  onSubmitSignUp() {
    const { email, domain } = this.signUpForm.value;
    const payload = {
      email,
      domain,
    };
    if (this.signUpForm.valid && payload) {
      this.setValueToLocalStorage(email, domain);
      this.router.navigate(['/auth/create-password']);
    }
  }

  setValueToLocalStorage(email: any, domain: any) {
    localStorage.setItem('email', email);
    localStorage.setItem('domain', domain);
  }

  async onSubmitGoogleSignIn() {
    if (this.isDomainAvailable || !this.domain?.value) {
      this.isDomainAvailable = true;
      this.domain?.markAsTouched();
      return;
    }
    try {
      const data = await this.authService.googleSignIn();
      console.log(data);
      if (data && data?.response?.['access_token']) {
        const { email, idToken } = data;
        const payload = {
          email,
          idToken,
          account_type: AccountType.BUSINESS,
          custom_domain: this.domain?.value,
          type: Type.GOOGLE,
        };
        this.store.dispatch(signUp({ userData: payload }));

        // const google_access_token = data?.response?.['access_token'];
        // this.storageService.setGoogleAccessToken(google_access_token);
        // this.router.navigate(['/home']);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  navigateToSignIn() {
    this.router.navigateByUrl('/auth/log-in');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get domain() {
    return this.signUpForm.get('domain');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(false);
  }
}
