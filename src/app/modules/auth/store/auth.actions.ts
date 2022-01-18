import { createAction, props } from '@ngrx/store';
import { Auth } from './auth.interface';

export const signUp = createAction('[AuthModule] SIGN UP', props<{ user: Auth }>());

export const signUpSuccess = createAction('[AuthModule] SIGN UP SUCCESS', props<{ user: Auth[] }>());

export const signUpError = createAction('[AuthModule] SIGN UP ERROR',props<{error: String}>());

export const logIn = createAction('[AuthModule] LOGIN', props<{ user: Auth }>());

export const logInSuccess = createAction('[AuthModule] LOGIN SUCCESS', props<{ user: Auth[] }>());

export const logInError = createAction('[AuthModule] LOGIN ERROR',props<{error: String}>());

export const searchDomain = createAction('[Domain] searchDomain', props<{ searchDomain: string }>());
export const searchDomainSuccess = createAction('[Domain] searchDomainSuccess', props<{ domainItem: string }>());
export const searchDomainFail = createAction('[Domain] searchDomainFail', props<{ error: any }>());
