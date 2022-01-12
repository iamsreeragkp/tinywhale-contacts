import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { heroReducer, IHeroState } from '../../hero/store/hero.reducers';
import { IUserState, userReducer } from '../../user/store/user.reducers';
import { IAuthState, authReducer } from '../../auth/store/auth.reducers';

export interface IAppState {
  hero: IHeroState;
  user: IUserState;
  auth: IAuthState;
}

export const reducers: ActionReducerMap<IAppState> = {
  hero: heroReducer,
  user: userReducer,
  auth: authReducer,
};
export const metaReducers: MetaReducer<IAppState>[] = [];
