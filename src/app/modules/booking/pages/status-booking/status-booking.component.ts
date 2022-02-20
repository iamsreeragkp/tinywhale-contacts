import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { TimeRangeSerializedDate } from 'src/app/shared/interfaces/time-range.interface';
import { convert24HrsFormatToAmPm, getTimeRangeSerializedBasedOnDate } from 'src/app/shared/utils';
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
  ngUnsubscribe = new Subject<any>();
  isVis = false;
  timeRangeSerialized?: TimeRangeSerializedDate[];
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
      console.log(data);
      if (this.statusData?.order_session?.length) {
        this.timeRangeSerialized = getTimeRangeSerializedBasedOnDate(
          this.statusData?.order_session?.map((oS: any) => ({
            date: oS?.session?.date,
            timeRange: oS?.session?.class_time_range,
          }))
        );
        console.log(this.timeRangeSerialized);
      }
    });
  }
  navigateToEdit() {
    this.router.navigateByUrl(`/booking/edit-booking/${this.orderId}`);
  }

  ngOnDestroy() {
    this.store.dispatch(initBooking());
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
