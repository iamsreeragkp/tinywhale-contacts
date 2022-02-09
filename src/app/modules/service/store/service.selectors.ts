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

export const getServiceListStatus = createSelector(getServiceFeatureSelector, state => {
  return state?.getServiceList;
});

export const getBusinessLocationsStatus = createSelector(getServiceFeatureSelector, state => {
  return state?.getBusinessLocations;
});
