import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { IAppState } from 'src/app/modules/core/reducers';
import { getDashboardData } from 'src/app/modules/root/store/root.selectors';
import { getBusiness, initBusiness } from '../../store/website.actions';
import { BusinessInfo } from '../../store/website.interface';
import { getBusinessStatus } from '../../store/website.selectors';

@Component({
  selector: 'app-view-business-info',
  templateUrl: './view-business-info.component.html',
  styleUrls: ['./view-business-info.component.scss'],
})
export class ViewBusinessInfoComponent implements OnInit, OnDestroy {
  ngUnsubscriber = new Subject<void>();
  dashboardData: any;
  dashboard$: Observable<any>;
  businessObj?: BusinessInfo;
  business$: Observable<{ business?: BusinessInfo; status: boolean; error?: string } | undefined>;
  constructor(private store: Store<IAppState>) {
    this.dashboard$ = store.pipe(select(getDashboardData));
    this.business$ = store.pipe(select(getBusinessStatus));
    // store.dispatch(getDashboard());
    store.dispatch(getBusiness());
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$
      .pipe(
        takeUntil(this.ngUnsubscriber),
        filter(val => !!val)
      )
      .subscribe(data => {
        this.dashboardData = data;
      });
    this.business$
      .pipe(
        takeUntil(this.ngUnsubscriber),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data?.status && data?.business) {
          this.businessObj = data.business;
        } else {
          console.log(data?.error);
        }
      });
  }

  formatDate(date: any) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  ngOnDestroy() {
    this.store.dispatch(initBusiness());
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
