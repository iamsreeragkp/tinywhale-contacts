import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IBookingState } from './booking.reducers';

const getBookingFeatureSelector = createFeatureSelector<IBookingState>('booking');

export const getBookings = createSelector(getBookingFeatureSelector, state => {
  return state?.getBooking;
});

export const getBookingByIds = createSelector(getBookingFeatureSelector, state => {
  return state?.getBookingById;
});

export const getBookingInfo = createSelector(getBookingFeatureSelector, state => {
  return state?.BookingInfo;
});
