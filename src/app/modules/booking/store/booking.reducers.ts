import { createReducer, on, Action } from '@ngrx/store';
import { addBookingError, addBookingSuccess, getBookingByIdError, getBookingByIdSuccess, getBookingError, getBookingSuccess } from './booking.actions';

export const userFeatureKey = 'AuthState';

export interface IBookingState {
  BookingInfo:any;
  error:any,
  getBooking:any,
  getBookingById?: any
}

export const initialBookingState: IBookingState = {
  BookingInfo:[],
  error:'',
  getBooking: undefined,
  getBookingById:undefined
};

export const reducer = createReducer(
  initialBookingState,
  on(addBookingSuccess, (state, { response }) => ({
    ...state,
    BookingInfo:response
  })),
  on(getBookingSuccess, (state, { response }) => ({
    ...state,
    getBooking:response
  })),
  on(getBookingByIdSuccess, (state, { response }) => ({
    ...state,
    getBookingById:response
  })),
  on(addBookingError,getBookingByIdError,getBookingError, (state, { error }) => ({
    ...state,
    error:error
  })),
);

export function bookingReducer(state: IBookingState | undefined, action: Action): IBookingState {
  return reducer(state as IBookingState, action as Action);
}
