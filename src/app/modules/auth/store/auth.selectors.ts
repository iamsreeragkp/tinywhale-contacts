import { createSelector } from '@ngrx/store';
import { IAppState } from '../../core/reducers';
import { IAuthState } from './auth.reducers';

export const selectaccessToken = createSelector(
  (state: IAppState) => state.auth,
  (state: IAuthState) => state.accessToken
);

export const selectrefreshToken = createSelector(
  (state: IAppState) => state.auth,
  (state: IAuthState) => state.refreshToken
);
