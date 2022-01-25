import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IWebsiteState } from './website.reducers';

const getWebsiteFeatureSelector = createFeatureSelector<IWebsiteState>('website');

export const getBusinessStatus = createSelector(getWebsiteFeatureSelector, state => {
  return state?.getBusiness;
});

export const getAddBusinessStatus = createSelector(
  getWebsiteFeatureSelector,
  state => state?.addBusiness
);
