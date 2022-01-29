import { createAction, props } from '@ngrx/store';

export const addBooking = createAction(
  '[BookingModule] add Booking',
  props<{ bookingData: any }>()
);

export const addBookingSuccess = createAction(
  '[BookingModule] add Booking SUCCESS',
  props<{ response?: any }>()
);

export const addBookingError = createAction(
  '[BookingModule] add Booking Error',
  props<{ error?: any }>()
);

export const getBooking = createAction('[BookingModule] get Booking');

export const getBookingSuccess = createAction(
  '[BookingModule] get Booking SUCCESS',
  props<{ response?: any }>()
);

export const getBookingError = createAction(
  '[BookingModule] get Booking Error',
  props<{ error?: any }>()
);

export const getBookingById = createAction('[BookingModule] get BookingById',props<{bookingId:any}>());

export const getBookingByIdSuccess = createAction(
  '[BookingModule] get BookingById SUCCESS',
  props<{ response?: any }>()
);

export const getBookingByIdError = createAction(
  '[BookingModule] get BookingById Error',
  props<{ error?: any }>()
);
