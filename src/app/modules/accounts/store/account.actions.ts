import { createAction, props } from '@ngrx/store';
import { AccountAddPayload, AccountInfo } from './account.interface';

export const addPayment = createAction(
  '[PaymentModule] add payment',
  props<{ paymentData: AccountAddPayload }>()
);

export const addPaymentSuccess = createAction(
  '[PaymentModule] add payment SUCCESS',
  props<{ response?: any }>()
);

export const addPaymentError = createAction(
  '[PaymentModule] add payment SUCCESS',
  props<{ error?: any }>()
);

export const getPayment = createAction('[PaymentModule] get payment');

export const getPaymentSuccess = createAction(
  '[PaymentModule] get payment SUCCESS',
  props<{ response?: AccountInfo }>()
);

export const getPaymentError = createAction(
  '[PaymentModule] get payment SUCCESS',
  props<{ error?: any }>()
);
