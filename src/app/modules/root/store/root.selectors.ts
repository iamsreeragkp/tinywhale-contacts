import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IRootState } from './root.reducers';

const getRootFeatureSelector = createFeatureSelector<IRootState>('root');

export const getDashboardData = createSelector(getRootFeatureSelector, state => {
  return state?.dashboard;
});

export const getDashboardLists = createSelector(getRootFeatureSelector, state => {
  return state?.getDashboardList;
});
