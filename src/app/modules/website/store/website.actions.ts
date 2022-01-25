import { createAction, props } from '@ngrx/store';
import { BusinessEditPayload, BusinessInfo } from './website.interface';

export const addBusiness = createAction(
  '[BusinessModule] add business',
  props<{ businessData: BusinessEditPayload }>()
);
export const addBusinessStatus = createAction(
  '[BusinessModule] add business STATUS',
  props<{ response?: any; status: boolean; error?: string }>()
);

export const getBusiness = createAction('[Business] GetBusiness');
export const getBusinessStatus = createAction(
  '[Business] GetBusinessSuccess',
  props<{ business?: BusinessInfo; status: boolean; error?: string }>()
);

export const initBusiness = createAction('[Business] INIT');
