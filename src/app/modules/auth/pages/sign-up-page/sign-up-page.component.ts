import { Component, OnDestroy, OnInit } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn } from 'ng-animate';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, filter, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { IAuthState } from '../../store/auth.reducers';
import {
  checkEmailExists,
  checkEmailExistsSuccess,
  searchDomain,
  signUpError,
} from '../../store/auth.actions';
import {
  getCheckEmailExistsStatus,
  getDomainData,
  getSignUpFail,
} from '../../store/auth.selectors';
import { environment } from 'src/environments/environment';

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
  redirectMode = false;

  search$ = new Subject<string>();
  ngUnsubscribe = new Subject<any>();
  isChecking = false;
  checkEmailExists$: Observable<{ exists?: boolean; message?: string }>;
  signUpFail$: Observable<string>;

  constructor(
    private router: Router,
    private store: Store<IAuthState>,
    private route: ActivatedRoute
  ) {
    this.signUpForm = this.createSignupForm();
    this.checkEmailExists$ = this.store.pipe(select(getCheckEmailExistsStatus));
    this.signUpFail$ = this.store.pipe(select(getSignUpFail));
    const routeData = router.getCurrentNavigation()?.extras.state;
    if (routeData?.['error']) {
      const [field, value] = routeData?.['data'];
      setTimeout(() => {
        this.signUpForm.get(field)?.patchValue(value);
        store.dispatch(signUpError({ error: routeData?.['message'] }));
        if (field === 'domain') {
          this.search$.next(value);
        }
      }, 500);
    } else if (routeData?.['google-redirect']) {
      this.signUpForm.get('email')?.patchValue(routeData?.['data']);
      this.redirectMode = true;
    }
  }

  ngOnInit() {
    this.subscriptions();
  }

  subscriptions() {
    this.search$
      .pipe(
        tap(() => {
          this.isChecking = true;
          this.domain?.markAsTouched();
        }),
        filter(() => {
          this.isDomainAvailable =
            this.domain?.errors?.['required'] || this.domain?.errors?.['pattern'];
          if (this.isDomainAvailable) {
            this.isChecking = false;
          }
          return !this.isDomainAvailable;
        }),
        debounceTime(500)
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
    this.checkEmailExists$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => val.exists !== undefined)
      )
      .subscribe(checkEmailStatus => {
        if (checkEmailStatus?.exists) {
          this.setFormError(checkEmailStatus?.message);
        } else {
          const { email, domain } = this.signUpForm.value;
          this.setValueToLocalStorage(email, domain);
          this.router.navigate(['/auth/create-password']);
        }
        this.store.dispatch(checkEmailExistsSuccess({ exists: undefined, message: undefined }));
      });
    this.signUpFail$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(err => {
        this.setFormError(err);
        this.store.dispatch(signUpError({ error: undefined }));
      });
  }

  setFormError(err?: string) {
    this.signUpForm.setErrors({ signUpFail: err ?? null });
    this.signUpForm.valueChanges.pipe(take(1)).subscribe(() => {
      this.signUpForm.setErrors({ signUpFail: null });
      this.signUpForm.updateValueAndValidity();
    });
  }

  createSignupForm() {
    return new FormGroup({
      domain: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\-]*$/)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
    });
  }

  onSubmitSignUp() {
    if (!this.signUpForm.valid || this.isDomainAvailable) {
      this.signUpForm.markAllAsTouched();
      return;
    }
    const { email } = this.signUpForm.value;
    this.store.dispatch(checkEmailExists({ email }));
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
    const domain_name = window.btoa(
      JSON.stringify({
        custom_domain: this.domain.value,
        account_type: 'BUSINESS',
      })
    );
    window.location.href = `${environment.api_end_point}/auth/google?tk=${domain_name}&redirected=${this.redirectMode}`;
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
    this.ngUnsubscribe.next(true);
  }
}
