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
