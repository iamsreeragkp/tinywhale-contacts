import { createAction, props } from '@ngrx/store';

export const signUp = createAction(
  '[AuthModule] SIGN UP',
  props<{ firstName: string; lastName: string; email: string; password: string }>()
);

export const signUpSuccess = createAction(
  '[AuthModule] SIGN UP SUCCESS',
  props<{ accessToken: string; refreshToken: string }>()
);

export const signUpError = createAction('[AuthModule] SIGN UP ERROR');

export const logIn = createAction(
  '[AuthModule] LOGIN',
  props<{ email: string; password: string }>()
);

export const logInSuccess = createAction(
  '[AuthModule] LOGIN SUCCESS',
  props<{ accessToken: string; refreshToken: string }>()
);

export const logInError = createAction('[AuthModule] LOGIN ERROR');
