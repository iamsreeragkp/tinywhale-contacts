import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IRootState } from 'src/app/modules/root/store/root.reducers';
import { getDashboardData } from 'src/app/modules/root/store/root.selectors';
import { getBookingList } from '../../store/booking.actions';
import { getBookingListStatus } from '../../store/booking.selectors';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss'],
})
export class ViewBookingComponent implements OnInit, OnDestroy {
  dashboard$: Observable<any>;
  ngUnsubscriber = new Subject<void>();
  dashboardInfos: any = undefined;
  bookingCount!: number;
  viewDetailsDisplay = "none";
  viewDetailsButton = "View Details"
  constructor(private store: Store<IRootState>) {
    this.dashboard$ = store.pipe(select(getDashboardData));
    this.store.dispatch(getBookingList({ filters: {} }));
    this.store.pipe(select(getBookingListStatus)).subscribe((data: any) => {
      console.log('data', data);
      this.bookingCount = data?.bookingsCount;
    });
  }
  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions() {
    this.dashboard$.pipe(takeUntil(this.ngUnsubscriber)).subscribe(data => {
      this.dashboardInfos = data;
    });
  }

  contactViewDetails(){
    if(this.viewDetailsDisplay=="none"){
      this.viewDetailsDisplay = "block";
      this.viewDetailsButton = "Hide Details"
    } else {
      this.viewDetailsDisplay = "none";
      this.viewDetailsButton = "View Details"
    }
  }

  get hasStarted() {
    return this.dashboardInfos?.domainActive || this.dashboardInfos?.businessInfo?.isCompleted;
  }

  ngOnDestroy(): void {
    this.ngUnsubscriber.next();
    this.ngUnsubscriber.complete();
  }
}
