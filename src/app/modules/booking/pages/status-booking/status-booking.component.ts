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
  productType: String = "SERVICE"
  isVis = false;
  isSessionCompleted: boolean = true;
  timingArray: any[] = []
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
      if (data?.["order_line_item"].length) {
        this.productType = this.getProductType(data?.["order_line_item"]?.[0])
      }
      this.orderId = data?.order_id;
      if (this.statusData?.order_session?.length) {
        this.isSessionCompleted = this.checkIfCompleted(this.statusData?.order_session);
        this.timeRangeSerialized = getTimeRangeSerializedBasedOnDate(
          this.statusData?.order_session?.map((oS: any) => ({
            date: oS?.session?.date,
            timeRange: oS?.session?.class_time_range,
          }))
        );
      }
    });
  }
  navigateToEdit() {
    this.router.navigateByUrl(`/booking/edit-booking/${this.orderId}`);
  }

  checkIfCompleted(sessions: any) {
    let sortedSessions;

    if (sessions.length > 1) {
      sortedSessions = sessions.slice().sort((a: any, b: any) => {
        return (
          +new Date(
            this.convertToDate(
              b['session']['date'],
              b['session']['class_time_range']['start_time']
            )
          ) -
          +new Date(
            this.convertToDate(
              a['session']['date'],
              a['session']['class_time_range']['start_time']
            )
          )
        );
      })
    }
    else {
      sortedSessions = sessions
    }
    const finalSession = sortedSessions[0];
    const finalSessionTime = this.convertToDate(finalSession['session']['date'], finalSession['session']['class_time_range']['start_time']);
    console.log("Time", +new Date - +finalSessionTime);
    return (+new Date - +finalSessionTime) > 1 ? true : false

  }

  convertToDate(dateString: string, timeString: string = '0000') {
    const dateArray = dateString.split('-');
    const date = new Date(+dateArray[0], +dateArray[1] - 1, +dateArray[2]);
    const time = timeString;
    const minutes = parseInt(timeString.slice(2));
    const hours = parseInt(timeString.slice(0, 2));
    const totalTime = new Date(date.getTime() + minutes * 60000 + hours * 60 * 60000);
    return totalTime;
  }

  getProductType(lineItem: any) {
    return lineItem?.["product"]?.product_type ?? "SERVICE"
  }

  ngOnDestroy() {
    this.store.dispatch(initBooking());
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
