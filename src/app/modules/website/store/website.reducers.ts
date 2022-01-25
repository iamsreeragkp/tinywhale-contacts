import { createReducer, on, Action } from '@ngrx/store';
import { addBusinessStatus, getBusinessStatus, initBusiness } from './website.actions';
import { BusinessInfo } from './website.interface';

export const userFeatureKey = 'AuthState';

export interface IWebsiteState {
  addBusiness?: {
    response?: any;
    status: boolean;
    error?: string;
  };
  getBusiness?: {
    business?: BusinessInfo;
    status: boolean;
    error?: string;
  };
}

export const initialWebsiteState: IWebsiteState = {
  addBusiness: undefined,
  getBusiness: undefined,
};

export const reducer = createReducer(
  initialWebsiteState,
  on(addBusinessStatus, (state, { response, status, error }) => ({
    ...state,
    addBusiness: { response, status, error },
  })),
  on(getBusinessStatus, (state, { business, error, status }) => ({
    ...state,
    getBusiness: {
      business,
      error,
      status,
    },
  })),
  on(initBusiness, () => initialWebsiteState)
);

export function websiteReducer(state: IWebsiteState | undefined, action: Action): IWebsiteState {
  return reducer(state as IWebsiteState, action as Action);
}
