import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { convert24HrsFormatToAmPm } from 'src/app/shared/utils';
import { getBookingById, initBooking } from '../../store/booking.actions';
import { IBookingState } from '../../store/booking.reducers';
import { getBookingByIds, getBookingInfo } from '../../store/booking.selectors';

@Component({
  selector: 'app-status-booking',
  templateUrl: './status-booking.component.html',
  styleUrls: ['./status-booking.component.scss'],
})
export class StatusBookingComponent implements OnInit, OnDestroy {
  statusData: any;
  settledInvoice = true;
  orderId!: number;
  classTimeRanged: any;
  startTime: any;
  endTime: any;
  ngUnsubscribe = new Subject<any>();
  isVis = false;
  constructor(
    private router: Router,
    private store: Store<IBookingState>,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(getBookingById({ bookingId: this.route.snapshot.params['id'] }));
    this.route.queryParamMap.subscribe((data: any) => {
      if (data?.params?.fromList) {
        this.isVis = true;
      } else {
        setTimeout(() => {
          this.settledInvoice = true;
        }, 2000);
      }
    });
  }

  ngOnInit(): void {
    if (!this.isVis) {
      this.settledInvoice = false;
    }
    this.subscriptions();
  }

  subscriptions() {
    this.store.pipe(select(getBookingByIds)).subscribe((data: any) => {
      this.statusData = data;
      this.orderId = data?.order_id;
      this.startTime = convert24HrsFormatToAmPm(
        this.statusData?.order_session?.[0]?.session?.class_time_range?.start_time
      );
      this.endTime = convert24HrsFormatToAmPm(
        this.statusData?.order_session?.[0]?.session?.class_time_range?.end_time
      );
      this.classTimeRanged = this.startTime + ' - ' + this.endTime;
    });
  }
  navigateToEdit() {
    this.router.navigateByUrl(`/booking/edit-booking/${this.orderId}`);
  }

  getDayName(date: any) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(date);
    const dayName = days[d.getDay()];
    return dayName;
  }

  ngOnDestroy() {
    this.store.dispatch(initBooking());
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
