import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IRootState } from 'src/app/modules/root/store/root.reducers';
import { getDashboardData } from 'src/app/modules/root/store/root.selectors';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss'],
})
export class ViewBookingComponent implements OnInit {
  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  dashboardInfos: any = undefined;
  constructor(private store: Store<IRootState>) {
    this.dashboard$ = store.pipe(select(getDashboardData));
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data;
    });
  }

  get hasStarted() {
    return this.dashboardInfos?.domainActive || this.dashboardInfos?.bookingInfo?.isStarted;
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
