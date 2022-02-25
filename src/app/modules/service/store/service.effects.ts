import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of, mergeMap, merge, take } from 'rxjs';
import { getDashboard } from '../../root/store/root.actions';

import { ServiceService } from '../service.service';
import {
  addService,
  addServiceStatus,
  changeVisibility,
  changeVisibilityError,
  changeVisibilitySuccess,
  deleteServiceList,
  deleteServiceListError,
  deleteServiceListSuccess,
  getBusinessLocations,
  getBusinessLocationsStatus,
  getService,
  getServiceList,
  getServiceListStatus,
  getServiceStatus,
} from './service.actions';

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
            getDashboard({ filters: {} }),
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

  getServiceList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getServiceList),
      switchMap(({ filters }) =>
        this.productService.getServiceList(filters).pipe(
          map((response: any) =>
            getServiceListStatus({
              products: response.data,
              productsCount: response.count,
              status: true,
            })
          ),
          catchError(err => of(getServiceListStatus({ error: err, status: false })))
        )
      )
    )
  );

  deleteService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteServiceList),
      switchMap(({ productId, filters }) =>
        this.productService.deleteService(productId).pipe(
          mergeMap(() => [
            deleteServiceListSuccess(),
            ...(filters ? [getServiceList({ filters })] : []),
          ]),
          catchError(error => of(deleteServiceListError({ error })))
        )
      )
    )
  );

  changeVisibility$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changeVisibility),
      switchMap(({ productId, visibility, filters }) =>
        this.productService.visibilityChange(productId, visibility).pipe(
          mergeMap(response => [
            changeVisibilitySuccess({ products: response, status: true }),
            ...(filters ? [getServiceList({ filters })] : []),
            getService({ product_id: productId }),
          ]),
          catchError(error =>
            of(
              changeVisibilityError({
                error: error?.error?.message ?? error?.message,
              })
            )
          )
        )
      )
    )
  );

  getBusinessLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getBusinessLocations),
      switchMap(() =>
        this.productService.getBusinessLocations().pipe(
          map((response: any) =>
            getBusinessLocationsStatus({ businessLocations: response.data, status: true })
          ),
          catchError(err => of(getBusinessLocationsStatus({ error: err, status: false })))
        )
      )
    )
  );
}
