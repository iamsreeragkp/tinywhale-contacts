import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';


@Injectable()
export class BookingEffects {
  constructor(private actions$: Actions) {}

}
