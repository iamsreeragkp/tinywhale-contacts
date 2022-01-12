import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export const userFeatureKey = 'AuthState';

export interface IAuthState {
  accessToken?: string;
  refreshToken?: string;
}

export const initialHeroState: IAuthState = {
  accessToken: undefined,
  refreshToken: undefined,
};

export const reducer = createReducer(
  initialHeroState,
  on(AuthActions.signUpSuccess, (state, { accessToken, refreshToken }) => ({
    ...state,
    accessToken,
    refreshToken,
  })),
  on(AuthActions.signUpError, state => ({
    ...state,
    accessToken: undefined,
    refreshToken: undefined,
  }))
);

export function authReducer(state: IAuthState | undefined, action: Action): IAuthState {
  return reducer(state as IAuthState, action as Action);
}
