import { Location } from '@angular/common';

import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { debounceTime, filter, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { convert24HrsFormatToAmPm, getTimeRangeSerialized } from 'src/app/shared/utils';
import { BookingService } from '../../booking.service';
import {
  addBooking,
  getBookableSlots,
  getBookingById,
  initBooking,
} from '../../store/booking.actions';
import { BookingType, FilledSlotDetails } from '../../store/booking.interface';
import { IBookingState } from '../../store/booking.reducers';
import {
  getBookableSlotsStatus,
  getBookingByIds,
  getBookingInfo,
} from '../../store/booking.selectors';
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
  classTimeRanged: any;
  isToastError = false;
  slotNow: any;

  filledSlotsData$!: Observable<
    { response?: FilledSlotDetails; status: boolean; error?: string } | undefined
  >;
  filledSlots?: any;

  disabledWeekdays: any[] = [];
  disabledDates: any[] = [];

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
    this.getDataDate();
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

  isFree = false;

  ngOnInit(): void {
    this.bookingForm
      .get('service')
      ?.valueChanges?.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(val => {
        const currClass = this.classData?.find((item: any) => item?.product_id === val);
        if (currClass?.class?.class_time_ranges) {
          this.isFree = false;
          this.classTimeRanged = currClass?.class?.class_time_ranges.map((classTimeRange: any) => ({
            id: classTimeRange?.class_time_range_id,
            label:
              convert24HrsFormatToAmPm(classTimeRange?.start_time) +
              ' - ' +
              convert24HrsFormatToAmPm(classTimeRange?.end_time),
          }));
          // this.updateSelectableSlots();
          this.store.dispatch(getBookableSlots({ productId: val }));

          this.classTimerangeId = this.classTimeRanged?.id;
        }

        if (currClass?.class?.class_packages?.[0]?.price === 0) {
          this.isFree = true;
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
  disableDated: any;
  getDataDate() {
    this.bookingForm
      .get('service')
      ?.valueChanges?.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.store.select(getBookableSlotsStatus).subscribe((data: any) => {
          this.disableDated = data?.response
            ?.filter((item: any) => !item?.is_date_selectable)
            .map((slot: any) => {
              const [year, month, day] = slot?.date?.split('-');
              return { year: +year, month: +month, day: +day };
            });
          // console.log(this.classTimeRanged, 'classTimeranged');
        });
      });
  }

  // updateSelectableSlots() {
  //   // this.sessions?.controls?.forEach(session => {
  //   //   session.get('selectableSlots')?.patchValue(this.getSelectableSlots(session.get('id')?.value));
  //   // });
  //   this.disabledDates = this.getDisabledDates();
  // }

  // getDisabledDates() {
  //   return [
  //     ...[this.filledSlots]
  //       .filter((slot: any) => !slot?.is_date_selectable)
  //       .map((slot: any) => {
  //         const [year, month, day] = slot?.date?.split('-');
  //         return { year: +year, month: +month, day: +day };
  //       }),
  //     // ...this.getAllSlotsUsedDates(),
  //   ];
  // }

  updateDate(event: any) {
    // console.log(event, 'eeeee');
  }

  initializeBookingForm(val?: any) {
    const timeRanges = val?.order_session?.[0]?.session?.class_time_range;
    this.slotNow = {
      id: timeRanges?.class_time_range_id,
      label:
        convert24HrsFormatToAmPm(timeRanges?.start_time) +
        ' - ' +
        convert24HrsFormatToAmPm(timeRanges?.end_time),
    };
    this.bookingForm.patchValue({
      email: val?.account?.User?.email,
      phonenumber: val?.phone_number,
      customername: val?.account?.first_name,
      service: val?.order_line_item[0]?.product?.product_id,
      date: new Date(val?.order_session[0]?.session?.date),
      slot: this.slotNow,
      payment: val?.payment,
    });
  }

  createBookingForm() {
    return new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      phonenumber: new FormControl('', Validators.required),
      customername: new FormControl('', Validators.required),
      service: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      slot: new FormControl('', Validators.required),
      payment: new FormControl(''),
    });
  }

  getDropdownData() {
    this.bookingService
      .getServiceDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
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
      date_time_range: [{ date: this.formatDate(date), class_time_range_id: slot }],
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment,
    };

    if (bookingPayload.phone_number === null) {
      delete bookingPayload['phone_number'];
    }
    if (bookingPayload.platform === null || bookingPayload.platform === '') {
      delete bookingPayload['platform'];
    }
    this.store.dispatch(addBooking({ bookingData: bookingPayload }));
    window.location.reload();
    this.router.navigate(['../booking/view-booking']);
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
      date_time_range: [{ date: this.formatDate(date), class_time_range_id: slot }],
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment,
    };

    if (bookingPayload.phone_number === null) {
      delete bookingPayload['phone_number'];
    }
    if (bookingPayload.platform === null || bookingPayload.platform === '') {
      delete bookingPayload['platform'];
    }
    this.store.dispatch(addBooking({ bookingData: bookingPayload }));
    this.store
      .select(getBookingInfo)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        if (data?.data?.user?.email) {
          this.router.navigate(['../booking/status-booking']);
        }
      });

    setTimeout(() => {
      this.isToastError = false;
    }, 3000);
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

      date_time_range: [{ date: this.formatDate(date), class_time_range_id: slot }],
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment || 'ONLINE',
      order_id: this.orderId,
    };

    if (bookingPayload.phone_number === null) {
      delete bookingPayload['phone_number'];
    }
    if (bookingPayload.platform === null || bookingPayload.platform === '') {
      delete bookingPayload['platform'];
    }
    this.store.dispatch(addBooking({ bookingData: bookingPayload }));
    this.location.back();
  }

  get sessions() {
    return this.bookingForm.get('slot');
  }

  onCancelBooking() {
    this.router.navigateByUrl('booking/view-booking');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
function getBookings(getBookings: any): import('rxjs').OperatorFunction<IBookingState, any> {
  throw new Error('Function not implemented.');
}
