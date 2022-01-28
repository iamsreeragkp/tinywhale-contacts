import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, mergeMap } from 'rxjs';
import { getDashboard } from '../../root/store/root.actions';

import { WebsiteService } from '../website.service';
import { addBusiness, addBusinessStatus, getBusiness, getBusinessStatus } from './website.actions';

@Injectable()
export class WebsiteEffects {
  constructor(private websiteService: WebsiteService, private actions$: Actions) {}

  addBusinessInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBusiness),
      switchMap(({ businessData }) =>
        this.websiteService.addBusinessInfo(businessData).pipe(
          mergeMap(response => [
            addBusinessStatus({ response: response, status: true }),
            getDashboard(),
          ]),
          catchError(error =>
            of(
              addBusinessStatus({
                status: false,
                error: error?.error?.message ?? error?.message,
              })
            )
          )
        )
      )
    )
  );

  getBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBusiness),
      switchMap(() =>
        this.websiteService.getBusiness().pipe(
          map((response: any) => getBusinessStatus({ business: response.data, status: true })),
          catchError(err => of(getBusinessStatus({ error: err, status: false })))
        )
      )
    )
  );
}
