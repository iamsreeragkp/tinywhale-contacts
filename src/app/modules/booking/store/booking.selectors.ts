import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IBookingState } from './booking.reducers';

const getBookingFeatureSelector = createFeatureSelector<IBookingState>('booking');
