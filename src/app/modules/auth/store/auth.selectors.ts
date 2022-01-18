import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState } from '../../core/reducers';
import { IAuthState } from './auth.reducers';

const getDamainFeatureSelector = createFeatureSelector<IAuthState>('auth');


export const selectaccessToken = createSelector(
  (state: IAppState) => state.auth,
  (state: IAuthState) => state.user
);

export const selectrefreshToken = createSelector(
  (state: IAppState) => state.auth,
  (state: IAuthState) => state.user
);

export const getDomainData=createSelector(
  getDamainFeatureSelector,
  state=>{
    return state.searchDomain
  }
)
