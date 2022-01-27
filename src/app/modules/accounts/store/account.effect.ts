import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { AccountService } from '../account.service';
import {
  addPayment,
  addPaymentError,
  addPaymentSuccess,
  getPayment,
  getPaymentError,
  getPaymentSuccess,
} from './account.actions';

@Injectable()
export class AccountEffects {
  constructor(private actions$: Actions, private accountService: AccountService) {}

  addAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addPayment),
      switchMap(({ paymentData }) =>
        this.accountService.addPayments(paymentData).pipe(
          map(response => addPaymentSuccess({ response: response })),
          catchError(error =>
            of(
              addPaymentError({
                error: error?.error?.message ?? error?.message,
              })
            )
          )
        )
      )
    )
  );

  getPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPayment),
      switchMap(() =>
        this.accountService.getPayment().pipe(
          map((response: any) => getPaymentSuccess({ response: response?.data })),
          catchError(err => of(getPaymentError({ error: err })))
        )
      )
    )
  );
}
