import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, mergeMap } from 'rxjs';
import { getDashboard } from '../../root/store/root.actions';

import { ServiceService } from '../service.service';
import { addService, addServiceStatus, getService, getServiceStatus } from './service.actions';

@Injectable()
export class ServiceEffects {
  constructor(private productService: ServiceService, private actions$: Actions) {}

  addServiceInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addService),
      switchMap(({ productData }) =>
        this.productService.addServiceInfo(productData).pipe(
          mergeMap(response => [
            addServiceStatus({ response: response.data, status: true }),
            getDashboard(),
          ]),
          catchError(error =>
            of(
              addServiceStatus({
                status: false,
                error: error?.error?.message ?? error?.message,
              })
            )
          )
        )
      )
    )
  );

  getService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getService),
      switchMap(({ product_id }) =>
        this.productService.getService(product_id).pipe(
          map((response: any) => getServiceStatus({ product: response.data, status: true })),
          catchError(err => of(getServiceStatus({ error: err, status: false })))
        )
      )
    )
  );
}
