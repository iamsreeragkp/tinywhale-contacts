import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { IAppState } from 'src/app/modules/core/reducers';
import { getService, initService } from '../../store/service.actions';
import { Product, WeekDay } from '../../shared/service.interface';
import { getServiceStatus } from '../../store/service.selectors';
import { ActivatedRoute } from '@angular/router';
import { TimeRangeSerialized } from 'src/app/shared/interfaces/time-range.interface';
import { getTimeRangeSerialized } from 'src/app/shared/utils';

@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.scss'],
})
export class ViewServiceComponent implements OnInit, OnDestroy {
  ngUnsubscriber = new Subject<void>();
  productObj?: Product;
  timeRangeSerialized?: TimeRangeSerialized[];
  product$: Observable<{ product?: Product; status: boolean; error?: string } | undefined>;
  constructor(private store: Store<IAppState>, private route: ActivatedRoute) {
    this.product$ = store.pipe(select(getServiceStatus));
    // store.dispatch(getDashboard());
    this.getProduct();
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  getProduct() {
    const product_id = +this.route.snapshot.params['id'];
    if (product_id) {
      this.store.dispatch(getService({ product_id }));
    }
  }

  subscriptions() {
    this.product$
      .pipe(
        takeUntil(this.ngUnsubscriber),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data?.status && data?.product) {
          this.productObj = data.product;
          if (this.productObj?.class?.class_time_ranges?.length) {
            this.timeRangeSerialized = getTimeRangeSerialized(
              this.productObj.class.class_time_ranges
            );
          }
        } else {
          console.log(data?.error);
        }
      });
  }

  get photoForPreview() {
    return this.productObj?.product_photos?.find(photo => photo.photo_url)?.photo_url;
  }

  get previewablePackages() {
    return (
      this.productObj?.class?.class_packages?.filter(pkg => pkg?.price && pkg?.no_of_sessions) ?? []
    );
  }

  ngOnDestroy() {
    this.store.dispatch(initService());
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
