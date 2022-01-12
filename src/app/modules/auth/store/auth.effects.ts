import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private authService: AuthService) {}

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUp),
      switchMap(({ email, password, firstName, lastName }) =>
        this.authService.signUp(firstName, lastName, email, password).pipe(
          map(({ accessToken, refreshToken }) =>
            AuthActions.signUpSuccess({ accessToken, refreshToken })
          ),
          catchError(() => of(AuthActions.signUpError()))
        )
      )
    )
  );

  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logIn),
      switchMap(({ email, password }) =>
        this.authService.logIn(email, password).pipe(
          map(({ accessToken, refreshToken }) =>
            AuthActions.logInSuccess({ accessToken, refreshToken })
          ),
          catchError(() => of(AuthActions.logInError()))
        )
      )
    )
  );
}
