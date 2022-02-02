import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAccountState } from './account.reducers';

const getAccountFeatureSelector = createFeatureSelector<IAccountState>('account');

export const getPayments = createSelector(getAccountFeatureSelector, state => {
  return state?.getAccount;
});

export const getAccountInfo = createSelector(getAccountFeatureSelector, state => {
  return state?.AccountInfo;
});

export const getKycInfo = createSelector(getAccountFeatureSelector, state => {
  return state?.kycData;
});
