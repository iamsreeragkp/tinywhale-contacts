import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

import {
  logIn,
  logInError,
  logInSuccess,
  searchDomain,
  searchDomainFail,
  searchDomainSuccess,
  signUp,
  signUpError,
  signUpSuccess,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService,
    private toastrService: ToastrService
  ) {}

  // signUp

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(signUp),
      switchMap(({ user }) =>
        this.authService.signUpUser(user).pipe(
          tap((data: any) => {
            // set token here
          }),
          map(({ response }) => signUpSuccess({ user: response })),
          catchError(error => of(signUpError({ error: error })))
        )
      )
    )
  );

  // logIn

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logIn),
      switchMap(({ user }) =>
        this.authService.loginUser(user).pipe(
          map(response => logInSuccess({ user: response })),
          catchError(error => of(logInError({ error: error })))
        )
      )
    )
  );

  loginRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[logInSuccess]),
        tap((action: any) => {
          if (action) {
            const access_token = action?.user?.['access-token'];
            this.storageService.setAccessToken(access_token);
            this.router.navigate(['/home']);
          }
        })
      );
    },
    { dispatch: false }
  );

  signUpRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[signUpSuccess]),
        tap((action: any) => {
          if (action) {
            this.router.navigate(['/home']);
          }
        })
      );
    },
    { dispatch: false }
  );

  //search Domain

  searchDomain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(searchDomain),
      mergeMap(action =>
        this.authService.checkDomainAvailability(action.searchDomain).pipe(
          map((domain: any) => searchDomainSuccess({ domainItem: domain })),
          catchError(err => of(searchDomainFail({ error: err })))
        )
      )
    )
  );
}
