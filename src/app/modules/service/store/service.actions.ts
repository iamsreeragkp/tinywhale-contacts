import { createAction, props } from '@ngrx/store';
import { ProductPayload, Product } from '../shared/service.interface';

export const addService = createAction(
  '[ServiceModule] ADD SERVICE',
  props<{ businessData: ProductPayload }>()
);
export const addServiceStatus = createAction(
  '[ServiceModule] ADD SERVICE STATUS',
  props<{ response?: any; status: boolean; error?: string }>()
);

export const getService = createAction('[ServiceModule] GET SERVICE');
export const getServiceStatus = createAction(
  '[ServiceModule] GET SERVICE STATUS',
  props<{ business?: Product; status: boolean; error?: string }>()
);

export const initService = createAction('[ServiceModule] INIT');
