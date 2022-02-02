import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, tap } from 'rxjs';
import { AccountService } from '../account.service';
import {
  addKyc,
  addKycError,
  addKycSuccess,
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
          tap(res => {
            if (res?.payment?.redirect_url) {
              const element = document.createElement('a');
              element.href = res?.payment?.redirect_url;
              element.target = '_blank';
              element.click();
            }
          }),
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

  registerKyc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addKyc),
      switchMap(({  }) =>
        this.accountService.kycRegister().pipe(
          tap((data:any)=>{
            if(data?.data?.redirect_url){
              const element = document.createElement('a');
              element.href = data?.data?.redirect_url;
              element.target = '_blank';
              element.click();
            }
          }),
          map(response => addKycSuccess({ response: response?.data })),
          catchError(error =>
            of(
              addKycError({
                error: error?.error?.message ?? error?.message,
              })
            )
          )
        )
      )
    )
  );
}
