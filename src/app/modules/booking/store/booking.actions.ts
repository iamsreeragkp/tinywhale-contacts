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

export const getBookingById = createAction(
  '[BookingModule] get BookingById',
  props<{ bookingId: any }>()
);

export const getBookingByIdSuccess = createAction(
  '[BookingModule] get BookingById SUCCESS',
  props<{ response?: any }>()
);

export const getBookingByIdError = createAction(
  '[BookingModule] get BookingById Error',
  props<{ error?: any }>()
);

export const getBookingList = createAction(
  '[BookingModule] GET BOOKING LIST',
  props<{ filters: any }>()
);

export const getBookingListSuccess = createAction(
  '[BookingModule] GET BOOKING LIST SUCCESS',
  props<{ bookingList?: any[]; status: boolean; error?: string }>()
);

export const getBookingListError = createAction(
  '[BookingModule] GET BOOKING LIST ERROR',
  props<{ status: boolean; error?: string }>()
);

export const initBooking = createAction('[Booking] INIT');

export const getBookableSlots = createAction(
  '[BookingModule] GET BOOKING SLOTS',
  props<{ productId: any }>()
);

export const getBookableSlotsSuccess = createAction(
  '[BookingModule] GET BOOKING SLOTS SUCCESS',
  props<{ response?: any }>()
);

export const getBookableSlotsError = createAction(
  '[BookingModule] GET BOOKING LIST ERROR',
  props<{ error?: string }>()
);
