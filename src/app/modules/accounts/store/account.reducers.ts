import { createReducer, on, Action } from '@ngrx/store';
import { addPaymentError, addPaymentSuccess, getPaymentError, getPaymentSuccess } from './account.actions';
import { AccountInfo } from './account.interface';

export const userFeatureKey = 'AuthState';

export interface IAccountState {
  AccountInfo:any;
  error:any,
  getAccount?: AccountInfo
}

export const initialAccountState: IAccountState = {
  AccountInfo:[],
  error:'',
  getAccount:undefined
};

export const reducer = createReducer(
  initialAccountState,
  on(addPaymentSuccess, (state, { response }) => ({
    ...state,
    AccountInfo:response
  })),
  on(getPaymentSuccess, (state, { response }) => ({
    ...state,
    getAccount:response
  })),
  on(addPaymentError,getPaymentError, (state, { error }) => ({
    ...state,
    error:error
  })),
);

export function accountReducer(state: IAccountState | undefined, action: Action): IAccountState {
  return reducer(state as IAccountState, action as Action);
}
