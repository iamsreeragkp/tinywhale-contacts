import { createReducer, on, Action } from '@ngrx/store';
import {
  addBookingError,
  addBookingSuccess,
  getBookableSlotsSuccess,
  getBookingByIdError,
  getBookingByIdSuccess,
  getBookingError,
  getBookingList,
  getBookingListError,
  getBookingListSuccess,
  getBookingSuccess,
  initBooking,
} from './booking.actions';

export const userFeatureKey = 'AuthState';

export interface IBookingState {
  BookingInfo: any;
  error: any;
  getBooking: any;
  getBookingById?: any;
  getBookingList?: {
    bookings?: any[];
    bookingscount?: number;
    status: boolean;
    error?: string;
  };
  getBookableSlots?: {
    response?: any;
  };
}

export const initialBookingState: IBookingState = {
  BookingInfo: undefined,
  error: '',
  getBooking: undefined,
  getBookingById: undefined,
  getBookingList: undefined,
  getBookableSlots: undefined,
};

export const reducer = createReducer(
  initialBookingState,
  on(addBookingSuccess, (state, { response }) => ({
    ...state,
    BookingInfo: response,
  })),
  on(getBookingSuccess, (state, { response }) => ({
    ...state,
    getBooking: response,
  })),
  on(getBookingByIdSuccess, (state, { response }) => ({
    ...state,
    getBookingById: response,
  })),
  on(
    addBookingError,
    getBookingByIdError,
    getBookingError,
    getBookingListError,
    (state, { error }) => ({
      ...state,
      error: error,
    })
  ),
  on(getBookingListSuccess, (state, { bookingList, bookingsCount, error, status }) => ({
    ...state,
    getBookingList: {
      bookingList,
      bookingsCount,
      error,
      status,
    },
  })),
  on(getBookableSlotsSuccess, (state, { response }) => ({
    ...state,
    getBookableSlots: {
      response,
    },
  })),
  on(initBooking, () => initialBookingState)
);

export function bookingReducer(state: IBookingState | undefined, action: Action): IBookingState {
  return reducer(state as IBookingState, action as Action);
}
