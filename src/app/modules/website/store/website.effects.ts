import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';

import { WebsiteService } from '../website.service';
import {
  addBusiness,
  addBusinessError,
  addBusinessSuccess,
  getBusiness,
  getBusinessFail,
  getBusinessSuccess,
} from './website.actions';

@Injectable()
export class WebsiteEffects {
  constructor(private websiteService: WebsiteService, private actions$: Actions) {}

  addBusinessInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBusiness),
      switchMap(({ businessData }) =>
        this.websiteService.addBusinessInfo(businessData).pipe(
          map(responses => addBusinessSuccess({ response: responses })),
          catchError(error =>
            of(addBusinessError({ error: error?.error?.message ?? error?.message }))
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
          map((business: any) => getBusinessSuccess({ business })),
          catchError(err => of(getBusinessFail({ error: err })))
        )
      )
    )
  );
}
