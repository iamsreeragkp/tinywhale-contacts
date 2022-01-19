import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Auth } from './auth.interface';

export const userFeatureKey = 'AuthState';

export interface IAuthState {
  user: Auth[];
  error: any;
  isAuthenticated: boolean;
  searchDomain: any;
}

export const initialAuthState: IAuthState = {
  user: [],
  error: '',
  isAuthenticated: false,
  searchDomain: null,
};

export const reducer = createReducer(
  initialAuthState,
  on(AuthActions.signUpSuccess, (state, { user }) => ({
    ...state,
    users: user,
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
  on(AuthActions.searchDomainFail, (state, { error }) => ({
    ...state,
    users: [],
    isAuthenticated: false,
    error: error,
  }))
);

export function authReducer(state: IAuthState | undefined, action: Action): IAuthState {
  return reducer(state as IAuthState, action as Action);
}
