import { createAction, props } from '@ngrx/store';

export const getDashboard = createAction('[Dashboard] GET DASHBOARD');
export const getDashboardSuccess = createAction(
  '[Dashboard] GET DASHBOARD SUCCESS',
  props<{ dashboard: any }>()
);
export const getDashboardError = createAction(
  '[Dashboard] GET DASHBOARD ERROR',
  props<{ error?: string }>()
);

export const getDashboardList = createAction(
  '[Dashboard] GET Dashboard LIST',
  props<{ filters: any }>()
);

export const getDashboardListSuccess = createAction(
  '[Dashboard] GET Dashboard LIST SUCCESS',
  props<{ DashboardList?: any[] }>()
);

export const getDashboardListError = createAction(
  '[Dashboard] GET Dashboard LIST ERROR',
  props<{ error?: string }>()
);
