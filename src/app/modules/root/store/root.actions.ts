import { createAction, props } from '@ngrx/store';

export const getDashboard = createAction('[Dashboard] GET DASHBOARD', props<{ filters: any }>());
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

export const publishWebsite = createAction('[Dashboard] PUBLISH WEBSITE');
