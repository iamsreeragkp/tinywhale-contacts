import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { User } from '../shared/user.model';
import { UserService } from '../user.service';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  getMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getMe),
      switchMap(() =>
        this.userService.getMe().pipe(
          map((user: User) => UserActions.getMeSuccess({ user })),
          catchError(() => of(UserActions.getMeError()))
        )
      )
    )
  );
}
