import { createReducer, on, Action } from '@ngrx/store';

export const userFeatureKey = 'AuthState';

export interface IBookingState {

}

export const initialBookingState: IBookingState = {

};

export const reducer = createReducer(
  initialBookingState,
  // on(, (state, { response }) => ({
  //   ...state,
  // })),
);

export function bookingReducer(state: IBookingState | undefined, action: Action): IBookingState {
  return reducer(state as IBookingState, action as Action);
}
