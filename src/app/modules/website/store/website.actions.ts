import { createAction, props } from '@ngrx/store';
import { BusinessEditPayload, BusinessInfo } from './website.interface';

export const addBusiness = createAction(
  '[BusinessModule] add business',
  props<{ businessData: BusinessEditPayload }>()
);
export const addBusinessSuccess = createAction(
  '[BusinessModule] add business SUCCESS',
  props<{ response: any }>()
);
export const addBusinessError = createAction(
  '[BusinessModule] add business ERROR',
  props<{ error?: string }>()
);

export const getBusiness = createAction('[Business] GetBusiness');
export const getBusinessSuccess = createAction(
  '[Business] GetBusinessSuccess',
  props<{ business: BusinessInfo }>()
);
export const getBusinessFail = createAction('[Business] GetBusinessFail', props<{ error: any }>());
