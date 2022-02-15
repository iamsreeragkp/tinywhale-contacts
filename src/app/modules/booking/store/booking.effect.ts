import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, of } from 'rxjs';
import { IAppState } from '../../core/reducers';
import { BookingService } from '../booking.service';
import {
  addBooking,
  addBookingError,
  addBookingSuccess,
  getBookableSlots,
  getBookableSlotsError,
  getBookableSlotsSuccess,
  getBooking,
  getBookingById,
  getBookingByIdError,
  getBookingByIdSuccess,
  getBookingError,
  getBookingList,
  getBookingListError,
  getBookingListSuccess,
  getBookingSuccess,
} from './booking.actions';

@Injectable()
export class BookingEffects {
  constructor(
    private actions$: Actions,
    private bookingService: BookingService,
    private store: Store<IAppState>
  ) {}

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

  // getBooking$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(getBooking),
  //     switchMap(() =>
  //       this.bookingService.getAllBookings().pipe(
  //         map((response: any) => getBookingSuccess({ response: response?.data })),
  //         catchError(err => of(getBookingError({ error: err })))
  //       )
  //     )
  //   )
  // );

  getBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBookingList),
      switchMap(({ filters }) =>
        this.bookingService.getBookingList(filters).pipe(
          map((response: any) =>
            getBookingListSuccess({ bookingList: response?.data, status: true })
          ),
          catchError(err => of(getBookingListError({ error: err, status: false })))
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

  getBookingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBookingList),
      switchMap(({ filters }) =>
        this.bookingService.getBookingList(filters).pipe(
          map((response: any) =>
            getBookingListSuccess({ bookingList: response.data, status: true })
          ),
          catchError(err => of(getBookingListError({ error: err, status: false })))
        )
      )
    )
  );

  //   getBookableSlots$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(getBookableSlots),
  //     withLatestFrom(this.store, (action, store) => {
  //       console.log(store);
  //       return {
  //         productId: store.service.getBookingById?.product_id,
  //       };
  //     }),
  //     switchMap(({ productId }) =>
  //       this.bookingService.getBookingDates(productId).pipe(
  //         map(response => getBookableSlotsStatus({ response: response?.data, status: true })),
  //         catchError(err =>
  //           of(
  //             getBookableSlotsStatus({ error: err?.error?.message ?? err?.message, status: false })
  //           )
  //         )
  //       )
  //     )
  //   )
  // );

  getBookingSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBookableSlots),
      switchMap(({ productId }) =>
        this.bookingService.getBookingDates(productId).pipe(
          map((response: any) => getBookableSlotsSuccess({ response: response?.data })),
          catchError(err => of(getBookableSlotsError({ error: err })))
        )
      )
    )
  );
}
