import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Auth, Otp } from './auth.interface';

export const userFeatureKey = 'AuthState';

export interface IAuthState {
  user: Auth[];
  error: any;
  isAuthenticated: boolean;
  searchDomain: any;
  otp: any;
  verifyOtp: any;
  resetPassword: any;
}

export const initialAuthState: IAuthState = {
  user: [],
  error: '',
  isAuthenticated: false,
  searchDomain: null,
  otp: null,
  verifyOtp: [],
  resetPassword: null,
};

export const reducer = createReducer(
  initialAuthState,
  on(AuthActions.signUpSuccess, (state, { user }) => ({
    ...state,
    user: user,
    isAuthenticated: true,
    error: '',
  })),
  on(AuthActions.logInSuccess, (state, { user }) => ({
    ...state,
    user: user,
    isAuthenticated: true,
    error: '',
  })),
  on(AuthActions.signUpError, AuthActions.logInError, state => ({
    ...state,
    user: [],
    isAuthenticated: false,
  })),
  on(AuthActions.searchDomainSuccess, (state, { domainItem }) => ({
    ...state,
    user: [],
    isAuthenticated: false,
    searchDomain: domainItem,
  })),
  on(
    AuthActions.searchDomainFail,
    AuthActions.setOtpFail,
    AuthActions.verifyOtpFail,
    AuthActions.passwordResetFail,
    (state, { error }) => ({
      ...state,
      user: [],
      isAuthenticated: false,
      error: error,
    })
  ),
  on(AuthActions.setOtpSuccess, (state, { response }) => ({
    ...state,
    otp: response,
    user: [],
    isAuthenticated: false,
    error: '',
  })),
  on(AuthActions.verifyOtpSuccess, (state, { response }) => ({
    ...state,
    verifyOtp: response,
    otp: response,
    user: [],
    isAuthenticated: false,
    error: '',
  })),
  on(AuthActions.passwordResetSuccess, (state, { response }) => ({
    ...state,
    resetPassword: response,
    user: [],
    isAuthenticated: false,
    error: '',
  }))
);

export function authReducer(state: IAuthState | undefined, action: Action): IAuthState {
  return reducer(state as IAuthState, action as Action);
}
