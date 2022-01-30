import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { BookingService } from '../booking.service';
import {
  addBooking,
  addBookingError,
  addBookingSuccess,
  getBooking,
  getBookingById,
  getBookingByIdError,
  getBookingByIdSuccess,
  getBookingError,
  getBookingSuccess,
} from './booking.actions';

@Injectable()
export class BookingEffects {
  constructor(private actions$: Actions, private bookingService: BookingService) {}

  addBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBooking),
      switchMap(({ bookingData }) =>
        this.bookingService.addBooking(bookingData).pipe(
          map(response => addBookingSuccess({ response: response })),
          catchError(error =>
            of(
              addBookingError({
                error: error?.error?.message ?? error?.message,
              })
            )
          )
        )
      )
    )
  );

  getBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBooking),
      switchMap(() =>
        this.bookingService.getAllBookings().pipe(
          map((response: any) => getBookingSuccess({ response: response?.data })),
          catchError(err => of(getBookingError({ error: err })))
        )
      )
    )
  );

  getBookingById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBookingById),
      switchMap(({ bookingId }) =>
        this.bookingService.getBookingById(bookingId).pipe(
          map((response: any) => getBookingByIdSuccess({ response: response?.data })),
          catchError(err => of(getBookingByIdError({ error: err })))
        )
      )
    )
  );
}