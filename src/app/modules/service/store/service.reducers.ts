import { createReducer, on, Action } from '@ngrx/store';
import {
  addServiceStatus,
  changeVisibilitySuccess,
  deleteServiceList,
  deleteServiceListSuccess,
  getBusinessLocationsStatus,
  getServiceList,
  getServiceListStatus,
  getServiceStatus,
  initService,
} from './service.actions';
import { LocationType, Product } from '../shared/service.interface';
import { BusinessLocation } from '../../accounts/store/account.interface';

export const userFeatureKey = 'AuthState';

export interface IServiceState {
  addService?: {
    response?: any;
    status: boolean;
    error?: string;
    autoSave: boolean;
  };
  getService?: {
    product?: Product;
    status: boolean;
    error?: string;
  };
  getServiceList?: {
    products?: Product[];
    productsCount?: number;
    status: boolean;
    error?: string;
  };
  getBusinessLocations?: {
    businessLocations?: BusinessLocation[];
    status: boolean;
    error?: string;
  };
  productId: any;
  visibility?: any;
}

export const initialServiceState: IServiceState = {
  addService: undefined,
  getService: undefined,
  getServiceList: undefined,
  productId: undefined,
  visibility: undefined,
  getBusinessLocations: undefined,
};

export const reducer = createReducer(
  initialServiceState,
  on(addServiceStatus, (state, { response, status, error, autoSave }) => ({
    ...state,
    addService: { response, status, error, autoSave },
  })),
  on(getServiceStatus, (state, { product, error, status }) => ({
    ...state,
    getService: {
      product,
      error,
      status,
    },
  })),
  on(getServiceListStatus, (state, { products, error, status, productsCount }) => ({
    ...state,
    getServiceList: {
      products,
      error,
      productsCount,
      status,
    },
  })),
  on(deleteServiceList, (state, { productId }) => ({
    ...state,
    productId: productId,
  })),
  on(changeVisibilitySuccess, (state, { products }) => ({
    ...state,
    visibility: products,
  })),
  on(getBusinessLocationsStatus, (state, { businessLocations, status, error }) => ({
    ...state,
    getBusinessLocations: {
      businessLocations,
      status,
      error,
    },
  })),
  on(initService, () => initialServiceState)
);

export function serviceReducer(state: IServiceState | undefined, action: Action): IServiceState {
  return reducer(state as IServiceState, action as Action);
}
