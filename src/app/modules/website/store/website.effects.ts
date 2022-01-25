import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';

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
          map(response => addBusinessStatus({ response: response, status: true })),
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
