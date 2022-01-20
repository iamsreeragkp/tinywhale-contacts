import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Auth, Otp } from './auth.interface';

export const userFeatureKey = 'AuthState';

export interface IAuthState {
  user: any;
  error: any;
  isAuthenticated: boolean;
  searchDomain: any;
  userData:any;
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
  userData:[]
};

export const reducer = createReducer(
  initialAuthState,
  on(AuthActions.signUpSuccess, (state, { response }) => ({
    ...state,
    userData: response,
    isAuthenticated: true,
    error: '',
  })),
  on(AuthActions.logInSuccess, (state, { user }) => ({
    ...state,
    users: user,
    isAuthenticated: true,
    error: '',
  })),
  on(AuthActions.signUpError, AuthActions.logInError, state => ({
    ...state,
    users: [],
    isAuthenticated: false,
  })),
  on(AuthActions.searchDomainSuccess, (state, { domainItem }) => ({
    ...state,
    users: [],
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
