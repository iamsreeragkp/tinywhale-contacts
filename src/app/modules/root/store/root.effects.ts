import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, tap } from 'rxjs';

import { RootService } from '../root.service';
import {
  getDashboard,
  getDashboardError,
  getDashboardSuccess,
  getDashboardList,
  getDashboardListSuccess,
  getDashboardListError,
} from './root.actions';

@Injectable()
export class RootEffects {
  constructor(private rootService: RootService, private actions$: Actions) {}

  getBusiness$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDashboard),
      switchMap(() =>
        this.rootService.getDashboard().pipe(
          map((response: any) => getDashboardSuccess({ dashboard: response?.data })),
          catchError(err => of(getDashboardError({ error: err })))
        )
      )
    )
  );

  getDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDashboardList),
      switchMap(({ filters }) =>
        this.rootService.getBookingList(filters).pipe(
          map((response: any) => getDashboardListSuccess({ DashboardList: response?.data })),
          catchError(err => of(getDashboardListError({ error: err })))
        )
      )
    )
  );
}
