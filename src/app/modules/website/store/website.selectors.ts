import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IWebsiteState } from './website.reducers';

const getWebsiteFeatureSelector = createFeatureSelector<IWebsiteState>('website');

export const getBusinessData = createSelector(getWebsiteFeatureSelector, state => {
  return state?.business;
});
