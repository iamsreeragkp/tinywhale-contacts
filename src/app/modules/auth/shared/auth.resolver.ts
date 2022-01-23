import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { AuthService } from '../auth.service';
import { logInSuccess } from '../store/auth.actions';
import { IAuthState } from '../store/auth.reducers';

const errorDataType = {
  domain_unavail: 'domain',
  email_exists: 'domain',
  redirect_to_signup: 'email',
};

@Injectable()
export class AuthResolver implements Resolve<Observable<void>> {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<IAuthState>
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    if (!Object.keys(route.queryParams ?? {}).length) {
      return of(route.data?.['auth']);
    }
    const { success, message, tk, type, data } = route.queryParams;
    if (success === 'true' && tk) {
      return this.authService.verifyToken(tk).pipe(
        map(response => {
          if (response?.success && response?.['access-token']) {
            this.store.dispatch(logInSuccess({ user: response }));
          } else {
            this.router.navigate(['auth', 'log-in']);
          }
          return response;
        })
      );
    }
    if (type !== 'redirect_to_signup' && message) {
      this.router.navigate(['auth', 'sign-up'], {
        state: {
          message,
          error: true,
          data: [errorDataType[type as keyof typeof errorDataType], data],
        },
        replaceUrl: true,
      });
      return of({});
    }
    this.router.navigate(['auth', 'sign-up'], {
      state: {
        'google-redirect': true,
        error: false,
        data,
      },
      replaceUrl: true,
    });
    return of({});
  }
}
