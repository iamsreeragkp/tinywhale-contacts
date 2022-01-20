import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState } from '../../core/reducers';
import { IAuthState } from './auth.reducers';

const getAuthFeatureSelector = createFeatureSelector<IAuthState>('auth');


export const selectaccessToken = createSelector(
  (state: IAppState) => state.auth,
  (state: IAuthState) => state.user
);

export const selectrefreshToken = createSelector(
  (state: IAppState) => state.auth,
  (state: IAuthState) => state.user
);

export const getDomainData=createSelector(
  getAuthFeatureSelector,
  state=>{
    return state.searchDomain
  }
)

export const getKey=createSelector(
  getAuthFeatureSelector,
  state=>{
    return state.otp;
  }
)
export const getError=createSelector(
  getAuthFeatureSelector,
  state=>{
    return state.error;
  }
)

export const getLogInError=createSelector(
  getAuthFeatureSelector,
  state=>{
    return state.logInError;
  }
)

export const getCheckEmailExistsStatus = createSelector(
  getAuthFeatureSelector,
  state => state.checkEmail
)

export const getSignUpFail = createSelector(
  getAuthFeatureSelector,
  state => state.signUpError
)