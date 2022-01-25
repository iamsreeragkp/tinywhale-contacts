import { createReducer, on, Action } from '@ngrx/store';
import {
  addBusinessError,
  addBusinessSuccess,
  getBusinessFail,
  getBusinessSuccess,
} from './website.actions';

export const userFeatureKey = 'AuthState';

export interface IWebsiteState {
  businessInfoData: any;
  error: any;
  business: any;
  currentData: any;
}

export const initialWebsiteState: IWebsiteState = {
  businessInfoData: [],
  error: '',
  business: undefined,
  currentData: [],
};

export const reducer = createReducer(
  initialWebsiteState,
  on(addBusinessSuccess, (state, { response }) => ({
    ...state,
    businessInfoData: response,
    error: '',
  })),
  on(addBusinessError, getBusinessFail, (state, { error }) => ({
    ...state,
    businessInfoData: undefined,
    error: error,
  })),
  on(getBusinessSuccess, (state, { business }) => ({
    ...state,
    business,
    error: '',
  }))
);

export function websiteReducer(state: IWebsiteState | undefined, action: Action): IWebsiteState {
  return reducer(state as IWebsiteState, action as Action);
}
