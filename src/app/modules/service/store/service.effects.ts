import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, mergeMap } from 'rxjs';

import { ServiceService } from '../service.service';
import { addService, addServiceStatus, getService, getServiceStatus } from './service.actions';

@Injectable()
export class ServiceEffects {
  constructor(private productService: ServiceService, private actions$: Actions) {}

  addServiceInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addService),
      switchMap(({ businessData }) =>
        this.productService.addServiceInfo(businessData).pipe(
          mergeMap(response => [
            addServiceStatus({ response: response, status: true }),
            getService(),
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
      switchMap(() =>
        this.productService.getService().pipe(
          map((response: any) => getServiceStatus({ business: response.data, status: true })),
          catchError(err => of(getServiceStatus({ error: err, status: false })))
        )
      )
    )
  );
}
