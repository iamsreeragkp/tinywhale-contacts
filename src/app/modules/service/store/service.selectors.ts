import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IServiceState } from './service.reducers';

const getServiceFeatureSelector = createFeatureSelector<IServiceState>('service');

export const getServiceStatus = createSelector(getServiceFeatureSelector, state => {
  return state?.getService;
});

export const getAddServiceStatus = createSelector(
  getServiceFeatureSelector,
  state => state?.addService
);
