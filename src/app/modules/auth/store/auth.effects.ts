import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

import {
  checkEmailExists,
  checkEmailExistsError,
  checkEmailExistsSuccess,
  logIn,
  logInError,
  logInSuccess,
  passwordReset,
  passwordResetFail,
  passwordResetSuccess,
  searchDomain,
  searchDomainFail,
  searchDomainSuccess,
  setOtp,
  setOtpFail,
  setOtpSuccess,
  signUp,
  signUpError,
  signUpSuccess,
  verifyOtp,
  verifyOtpFail,
  verifyOtpSuccess,
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

  // signUp$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(signUp),
  //     switchMap(({ userData }) =>
  //       this.authService.signUpUser(userData).pipe(
  //         tap((data: any) => {
  //           // set token here
  //         }),
  //         map(({ responses }) => signUpSuccess({ response: responses })),
  //         catchError(error => of(signUpError({ error: error })))
  //       )
  //     )
  //   )
  // );

  signUp$ = createEffect(() =>
  this.actions$.pipe(
    ofType(signUp),
    switchMap(({ userData }) =>
      this.authService.signUpUser(userData).pipe(
        map(responses => signUpSuccess({ response: responses })),
        catchError(error => of(signUpError({ error: error?.error?.message ?? error?.message })))
      )
    )
  )
);

  checkEmailExists$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkEmailExists),
      switchMap(({ email }) =>
        this.authService.checkEmailExits({ email }).pipe(
          map(response => checkEmailExistsSuccess(response)),
          catchError(error => of(checkEmailExistsError({ error: error?.error?.message ?? error?.message })))
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
          catchError(error => of(logInError({ error: error?.error?.message ?? error?.message })))
        )
      )
    )
  );

  sendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setOtp),
      switchMap(({ email }) =>
        this.authService.sendOtp(email).pipe(
          map(res => setOtpSuccess({ response: res })),
          catchError(error => of(setOtpFail({ error: error })))
        )
      )
    )
  );

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(verifyOtp),
      switchMap(({ data }) =>
        this.authService.verifyOtp(data).pipe(
          map(res => verifyOtpSuccess({ response: res })),
          catchError((error) =>{ console.log(error?.error?.message );
           return of(verifyOtpFail({ error: error?.error?.message }))})
        )
      )
    )
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(passwordReset),
      switchMap(({ password }) =>
        this.authService.resetPassword(password).pipe(
          map(res => passwordResetSuccess({ response: res })),
          catchError(error => of(passwordResetFail({ error: error })))
        )
      )
    )
  );

  loginRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[logInSuccess,signUpSuccess]),
        tap((action: any) => {
          if (action?.user?.['access-token']) {
            const access_token = action?.user?.['access-token'];
            this.storageService.setAccessToken(access_token);
            this.router.navigate(['/home']);
          }
          if(action?.response?.['access-token']){
            const access_token = action?.response?.['access-token'];
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

  verifyPasswordRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[verifyOtpSuccess]),
        tap((action: any) => {
          if (action) {
            this.router.navigate(['/auth/create-password'],{queryParams:{isVerified:true}});
          }
        })
      );
    },
    { dispatch: false }
  );

  resetPasswordRedirect$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(...[passwordResetSuccess]),
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
