import { createReducer, on, Action } from '@ngrx/store';
import { getDashboard, getDashboardListSuccess, getDashboardSuccess } from './root.actions';

export const rootFeatureKey = 'RootState';

export interface IRootState {
  dashboard?: any;
  getDashboardList: any;
}

export const initialRootState: IRootState = {
  dashboard: undefined,
  getDashboardList: undefined,
};

export const reducer = createReducer(
  initialRootState,
  on(getDashboardSuccess, (state, { dashboard }) => ({
    ...state,
    dashboard,
    error: '',
  })),
  on(getDashboardListSuccess, (state, { DashboardList }) => ({
    ...state,
    getDashboardList: DashboardList,
    error: '',
  }))
);

export function rootReducer(state: IRootState | undefined, action: Action): IRootState {
  return reducer(state as IRootState, action as Action);
}
