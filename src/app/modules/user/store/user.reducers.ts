import { createReducer, on, Action } from '@ngrx/store';
import * as UserActions from './user.actions';
import { User } from '../shared/user.model';

export const userFeatureKey = 'UserState';

export interface IUserState {
  me?: User;
}

export const initialUserState: IUserState = {
  me: undefined,
};

export const reducer = createReducer(
  initialUserState,
  on(UserActions.getMeSuccess, (state, { user }) => ({
    ...state,
    user,
  })),
  on(UserActions.getMeError, state => ({
    ...state,
    user: undefined,
  }))
);

export function userReducer(state: IUserState | undefined, action: Action): IUserState {
  return reducer(state as IUserState, action as Action);
}
