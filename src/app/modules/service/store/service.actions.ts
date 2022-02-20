import { createAction, props } from '@ngrx/store';
import { BusinessLocation } from '../../accounts/store/account.interface';
import {
  ProductPayload,
  Product,
  ServiceListFilter,
  VisibilityType,
  LocationType,
} from '../shared/service.interface';

export const addService = createAction(
  '[ServiceModule] ADD SERVICE',
  props<{ productData: ProductPayload; autoSave: boolean }>()
);
export const addServiceStatus = createAction(
  '[ServiceModule] ADD SERVICE STATUS',
  props<{ response?: any; status: boolean; error?: string; autoSave: boolean }>()
);

export const getService = createAction(
  '[ServiceModule] GET SERVICE',
  props<{ product_id: number }>()
);
export const getServiceStatus = createAction(
  '[ServiceModule] GET SERVICE STATUS',
  props<{ product?: Product; status: boolean; error?: string }>()
);

export const getServiceList = createAction(
  '[ServiceModule] GET SERVICE LIST',
  props<{ filters: ServiceListFilter }>()
);
export const getServiceListStatus = createAction(
  '[ServiceModule] GET SERVICE LIST STATUS',
  props<{ products?: Product[]; productsCount?: number; status: boolean; error?: string }>()
);

export const initService = createAction('[ServiceModule] INIT');

export const changeVisibility = createAction(
  '[ServiceModule] CHANGE VISIBILITY',
  props<{ productId: number; visibility: any; filters?: ServiceListFilter }>()
);
export const changeVisibilitySuccess = createAction(
  '[ServiceModule] CHANGE VISIBILITY SUCCESS',
  props<{ products?: any; status: boolean; error?: string }>()
);

export const changeVisibilityError = createAction(
  '[ServiceModule] CHANGE VISIBILITY Error',
  props<{ error?: string }>()
);

export const deleteServiceList = createAction(
  '[ServiceModule] DELETE SERVICE LIST',
  props<{ productId: number; filters?: ServiceListFilter }>()
);

export const deleteServiceListSuccess = createAction(
  '[ServiceModule] DELETE SERVICE LIST SUCCESS'
  // props<{ products?: Product[]; status: boolean; error?: string }>()
);

export const deleteServiceListError = createAction(
  '[ServiceModule] DELETE SERVICE LIST Error',
  props<{ error?: string }>()
);

export const getBusinessLocations = createAction('[ServiceModule] GET BUSINESS LOCATIONS');

export const getBusinessLocationsStatus = createAction(
  '[ServiceModule] GET BUSINESS LOCATIONS STATUS',
  props<{ businessLocations?: BusinessLocation[]; status: boolean; error?: string }>()
);
