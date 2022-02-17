import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { convert24HrsFormatToAmPm } from 'src/app/shared/utils';
import { getBookingById } from '../../store/booking.actions';
import { IBookingState } from '../../store/booking.reducers';
import { getBookingByIds, getBookingInfo } from '../../store/booking.selectors';

@Component({
  selector: 'app-status-booking',
  templateUrl: './status-booking.component.html',
  styleUrls: ['./status-booking.component.scss'],
})
export class StatusBookingComponent implements OnInit {
  statusData: any;
  settledInvoice = true;
  orderId!: number;
  classTimeRanged: any;
  startTime: any;
  endTime: any;
  constructor(
    private router: Router,
    private store: Store<IBookingState>,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(getBookingById({ bookingId: this.route.snapshot.params['id'] }));
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.settledInvoice = false;
    }, 1000);
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
}
