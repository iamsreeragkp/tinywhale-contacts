import { createSelector } from '@ngrx/store';
import { IAppState } from '../../core/reducers';
import { IUserState } from './user.reducers';

export const selectgetMe = createSelector(
  (state: IAppState) => state.user,
  (state: IUserState) => state.me
);
