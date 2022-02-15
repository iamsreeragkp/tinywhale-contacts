import { Location } from '@angular/common';

import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { debounceTime, filter, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { convert24HrsFormatToAmPm, getTimeRangeSerialized } from 'src/app/shared/utils';
import { BookingService } from '../../booking.service';
import { addBooking, getBookingById } from '../../store/booking.actions';
import { BookingType } from '../../store/booking.interface';
import { IBookingState } from '../../store/booking.reducers';
import { getBookingByIds, getBookingInfo } from '../../store/booking.selectors';
@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss'],
})
export class AddBookingComponent implements OnInit, OnDestroy {
  bookingForm!: FormGroup;
  // options = {
  //   format: 'yyyy-MM-dd',
  //   placeholder: 'Select date',
  // };
  classData: any;
  classTimeRanges: any;
  times: any;
  classTimerangeId: any;
  ngUnsubscribe = new Subject<any>();
  editMode = false;
  bookingData$: Observable<any>;
  orderId!: number;

  constructor(
    private authService: AuthService,
    private store: Store<IBookingState>,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location,
    private bookingService: BookingService
  ) {
    this.bookingForm = this.createBookingForm();
    this.getDropdownData();
    this.bookingData$ = this.store.pipe(select(getBookingByIds));
    route.url
      .pipe(
        takeUntil(this.ngUnsubscribe),
        map(urlSegments => urlSegments.some(url => url?.path.includes('edit-booking')))
      )
      .subscribe(editMode => {
        this.editMode = editMode;
        if (editMode) {
          this.zone.run(() => {
            setTimeout(() => {
              this.store.dispatch(getBookingById({ bookingId: this.route.snapshot.params['id'] }));
            }, 1000);
          });
        }
      });
  }

  ngOnInit(): void {
    this.bookingForm.get('service')?.valueChanges?.subscribe(val => {
      const currClass = this.classData?.find((item: any) => item?.product_id === val);
      if (currClass?.class?.class_time_ranges) {
        this.times = currClass?.class?.class_time_ranges;
        this.classTimerangeId = this.times[0]?.class_time_range_id;
      }
    });
    this.subscriptions();
  }

  subscriptions() {
    this.bookingData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data) {
          this.orderId = data?.order_id;
          this.initializeBookingForm(data);
        } else {
          console.log(data?.error);
        }
      });
  }

  initializeBookingForm(val?: any) {
    this.bookingForm.patchValue({
      email: val?.account?.User?.email,
      phonenumber: 8156778879,
      customername: val?.account?.first_name,
      service: val?.order_line_item[0]?.product?.product_id,
      date: new Date(val?.order_session[0]?.session?.date),
      slot: val?.slot,
      payment: val?.payment,
    });
  }

  createBookingForm() {
    return new FormGroup({
      email: new FormControl(''),
      phonenumber: new FormControl(''),
      customername: new FormControl(''),
      service: new FormControl(''),
      date: new FormControl(''),
      slot: new FormControl(''),
      payment: new FormControl(''),
    });
  }

  getDropdownData() {
    this.bookingService.getServiceDropdown().subscribe((data: any) => {
      this.classData = data?.data;
      this.classTimeRanges = data?.Classes;
    });
  }

  listNameArray: any = [];
  onBooking() {
    const { email, phonenumber, customername, service, date, slot, payment } =
      this.bookingForm.value;

    const customerName = customername.split(' ').slice(0, -1).join(' ');
    let lastName = customername.split(' ');

    if (lastName[1]) {
      lastName = lastName[1];
    } else {
      lastName = lastName[2];
    }

    const bookingPayload = {
      email: email,
      phone_number: phonenumber,
      first_name: customerName ? customerName : customername,
      last_name: lastName ? lastName : '',
      date_time_range: [
        { date: this.formatDate(date), class_time_range_id: this.classTimerangeId },
      ],
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment,
    };

    if (bookingPayload.phone_number === null) {
      delete bookingPayload['phone_number'];
    }
    this.store.dispatch(addBooking({ bookingData: bookingPayload }));
    window.location.reload();
    // this.router.navigate(['../booking/view-booking']);
  }

  onBookingAndExit() {
    const { email, phonenumber, customername, service, date, slot, payment } =
      this.bookingForm.value;
    const customerName = customername.split(' ').slice(0, -1).join(' ');
    let lastName = customername.split(' ');

    if (lastName[1]) {
      lastName = lastName[1];
    } else {
      lastName = lastName[2];
    }
    const bookingPayload = {
      email: email,
      phone_number: phonenumber,
      first_name: customerName ? customerName : customername,
      last_name: lastName ? lastName : '',
      date_time_range: [
        { date: this.formatDate(date), class_time_range_id: this.classTimerangeId },
      ],
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment,
    };
    if (bookingPayload.phone_number === null) {
      delete bookingPayload['phone_number'];
    }
    this.store.dispatch(addBooking({ bookingData: bookingPayload }));
    this.store.select(getBookingInfo).subscribe((data: any) => {
      if (data?.data?.user?.email) {
        this.router.navigate(['../booking/status-booking']);
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

  onUpdateBooking() {
    const { email, phonenumber, customername, service, date, slot, payment } =
      this.bookingForm.value;
    const customerName = customername.split(' ').slice(0, -1).join(' ');
    let lastName = customername.split(' ');

    if (lastName[1]) {
      lastName = lastName[1];
    } else {
      lastName = lastName[2];
    }
    const bookingPayload = {
      email: email,
      phone_number: phonenumber,
      first_name: customerName ? customerName : customername,
      last_name: lastName ? lastName : '',

      date_time_range: [
        { date: this.formatDate(date), class_time_range_id: this.classTimerangeId },
      ],
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment || 'ONLINE',
      order_id: this.orderId,
    };
    if (bookingPayload.phone_number === null) {
      delete bookingPayload['phone_number'];
    }
    this.store.dispatch(addBooking({ bookingData: bookingPayload }));
    this.location.back();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
