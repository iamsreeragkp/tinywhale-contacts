import { createReducer, on, Action } from '@ngrx/store';
import {
  addServiceStatus,
  changeVisibilitySuccess,
  deleteServiceList,
  deleteServiceListSuccess,
  getServiceList,
  getServiceListStatus,
  getServiceStatus,
  initService,
} from './service.actions';
import { Product } from '../shared/service.interface';

export const userFeatureKey = 'AuthState';

export interface IServiceState {
  addService?: {
    response?: any;
    status: boolean;
    error?: string;
  };
  getService?: {
    product?: Product;
    status: boolean;
    error?: string;
  };
  getServiceList?: {
    products?: Product[];
    status: boolean;
    error?: string;
  };
  productId:any;
  visibility?:any;
}

export const initialServiceState: IServiceState = {
  addService: undefined,
  getService: undefined,
  getServiceList: undefined,
  productId:undefined,
  visibility:undefined
};

export const reducer = createReducer(
  initialServiceState,
  on(addServiceStatus, (state, { response, status, error }) => ({
    ...state,
    addService: { response, status, error },
  })),
  on(getServiceStatus, (state, { product, error, status }) => ({
    ...state,
    getService: {
      product,
      error,
      status,
    },
  })),
  on(getServiceListStatus, (state, { products, error, status }) => ({
    ...state,
    getServiceList: {
      products,
      error,
      status,
    },
  })),
  on(deleteServiceList, (state,{productId}) => ({
    ...state,
    productId:productId
  })),
  on(changeVisibilitySuccess, (state,{products}) => ({
    ...state,
    visibility:products
  })),
  on(initService, () => initialServiceState)
);

export function serviceReducer(state: IServiceState | undefined, action: Action): IServiceState {
  return reducer(state as IServiceState, action as Action);
}
