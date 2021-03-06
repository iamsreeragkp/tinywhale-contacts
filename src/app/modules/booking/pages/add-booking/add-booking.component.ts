import { Location } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, map, Observable, skip, Subject, take, takeUntil } from 'rxjs';
import { WeekDay } from 'src/app/modules/service/shared/service.interface';
import { getServiceStatus } from 'src/app/modules/service/store/service.selectors';
import { convert24HrsFormatToAmPm, convertDateToDateString } from 'src/app/shared/utils';
import { BookingService } from '../../booking.service';
import { getPayment } from 'src/app/modules/accounts/store/account.actions';
import { getPayments } from 'src/app/modules/accounts/store/account.selectors';
import {
  addBooking,
  getBookableSlots,
  getBookingById,
  initBooking,
} from '../../store/booking.actions';

import { BookingType, FilledSlotDetails } from '../../store/booking.interface';
import {
  getBookableSlotsStatus,
  getBookingByIds,
  getBookingInfo,
  getError,
} from '../../store/booking.selectors';
import { IAppState } from 'src/app/modules/core/reducers';
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
  times: any;
  classTimerangeId: any;
  ngUnsubscribe = new Subject<any>();
  editMode = false;
  bookingData$: Observable<any>;
  serviceData$!: Observable<any>;
  paymentData$: Observable<any>;
  orderId!: number;
  classTimeRanged: any = [];
  isToastError = false;
  slotNow: any;
  isSaving = false;

  filledSlotsData$!: Observable<
    { response?: FilledSlotDetails; status: boolean; error?: string } | undefined
  >;

  filledSlots: FilledSlotDetails = [];
  disabledWeekdays: any[] = [];
  today = new Date();
  productInfos: any;
  selectableSlots: any[] = [];

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location,
    private bookingService: BookingService
  ) {
    store.dispatch(getPayment());
    this.bookingForm = this.createBookingForm();
    this.getDropdownData();
    this.paymentData$ = this.store.pipe(select(getPayments));
    this.serviceData$ = store.pipe(select(getServiceStatus));
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
      .subscribe((val: number) => {
        this.bookingForm.get('date')?.patchValue(null);
        const currClass = this.classData?.find((item: any) => item?.product_id === val);
        if (currClass?.price === 0) {
          this.isFree = true;
        } else {
          this.isFree = false;
        }
        if (currClass?.class?.class_time_ranges) {
          this.classTimeRanged = currClass?.class?.class_time_ranges.map((classTimeRange: any) => ({
            id: classTimeRange?.class_time_range_id,
            label:
              convert24HrsFormatToAmPm(classTimeRange?.start_time) +
              ' - ' +
              convert24HrsFormatToAmPm(classTimeRange?.end_time),
            day_of_week: classTimeRange?.day_of_week,
            start_time: classTimeRange?.start_time,
          }));
          // this.store.dispatch(getBookableSlots({ productId: val }));
          this.disabledWeekdays = this.getDisabledWeekdays();
          this.store.dispatch(getBookableSlots({ productId: val }));
          this.classTimerangeId = this.classTimeRanged?.id;
        }
      });
    this.bookingForm
      .get('date')
      ?.valueChanges.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(val => {
        console.log('updating slots');

        this.updateSelectableSlots();
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

    this.store
      .select(getBookableSlotsStatus)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe((data: any) => {
        if (data?.response) {
          this.filledSlots = data?.response;
          this.disableDated = data?.response
            ?.filter((item: any) => !item?.is_date_selectable)
            .map((slot: any) => {
              const [year, month, day] = slot?.date?.split('-');
              return { year: +year, month: +month, day: +day };
            });
          this.updateSelectableSlots();
        } else {
        }
      });
  }
  disableDated: any = [];

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
      phonenumber: val?.account?.phone_number,
      customername: `${val?.account?.first_name ?? ''} ${val?.account?.last_name ?? ''}`,
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
      phonenumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\+\d{1,3})[ -]?\d{8,15}$/),
      ]),
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
      });
  }

  listNameArray: any = [];
  productId: any;

  onBookingAndExit() {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;
    const { email, phonenumber, customername, service, date, slot, payment } =
      this.bookingForm.value;
    const customerName = customername.split(' ').slice(0, -1).join(' ');
    let lastName = customername.split(' ');

    if (lastName[1]) {
      lastName = lastName[1];
    } else {
      lastName = lastName[2];
    }
    const bookingPayload: any = {
      email: email,
      phone_number: phonenumber,
      first_name: customerName ? customerName : customername,
      last_name: lastName ? lastName : '',
      date_time_range: [{ date: this.formatDate(date), class_time_range_id: slot }],
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment || 'OFFLINE',
    };

    if (this.editMode) {
      bookingPayload['order_id'] = this.orderId;
    }

    if (bookingPayload.phone_number === null) {
      delete bookingPayload['phone_number'];
    }
    if (bookingPayload.platform === null || bookingPayload.platform === '') {
      delete bookingPayload['platform'];
    }
    this.store.dispatch(addBooking({ bookingData: bookingPayload }));
    this.store
      .select(getBookingInfo)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe((data: any) => {
        this.productId = data?.data?.order?.order_id;
        if (data) {
          this.isSaving = false;
          if (!this.editMode) {
            this.router.navigate([`../booking/status-booking/${this.productId}`]);
          } else {
            this.location.back();
          }
        }
      });

    this.store
      .select(getError)
      .pipe(skip(1), take(1))
      .subscribe(err => {
        if (err) {
          this.isSaving = false;
          console.log(err);
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

  // get sessions() {
  //   return this.bookingForm.get('slot');
  // }

  /**
   * Function which sets the disabled weekdays in which no slots are available.
   * Called when booking data is loaded
   * @returns {Array.<WeekDayMyDpStr>} disabledWeekdays
   */
  getDisabledWeekdays() {
    type WeekDayMyDpStr = 'su' | 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa';
    const weekDayMyDpStrArr: WeekDayMyDpStr[] = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
    const weekDayMyDpStringToWeekDayNumberMap: { [k in WeekDayMyDpStr]: WeekDay } = {
      su: WeekDay.Sunday,
      mo: WeekDay.Monday,
      tu: WeekDay.Tuesday,
      we: WeekDay.Wednesday,
      th: WeekDay.Thursday,
      fr: WeekDay.Friday,
      sa: WeekDay.Saturday,
    };
    const selectedService = this.classData?.find(
      (classD: any) => classD.product_id === this.bookingForm.get('service')?.value
    );
    return weekDayMyDpStrArr.filter(
      weekDay =>
        !selectedService?.class?.class_time_ranges?.some(
          (timeRange: any) => timeRange.day_of_week === weekDayMyDpStringToWeekDayNumberMap[weekDay]
        )
    );
  }

  updateSelectableSlots() {
    this.selectableSlots = this.getSelectableSlots();
  }

  getSelectableSlots() {
    return this.classTimeRanged.filter((timeRange: any) => {
      const selectedDate = this.bookingForm.get('date')?.value;
      if (!selectedDate) {
        return false;
      }
      const weekDay = `${selectedDate?.getDay() + 1}`;
      if (timeRange.day_of_week !== weekDay) {
        return false;
      }
      const isToday = new Date().toDateString() === selectedDate?.toDateString();
      if (isToday && +timeRange.label < +`${new Date().getHours()}${new Date().getMinutes()}`) {
        return false;
      }
      return !this.filledSlots
        ?.find(slot => slot.date === convertDateToDateString(selectedDate))
        ?.filled_class_time_range_ids.includes(timeRange.id);
    });
  }

  onCancelBooking() {
    this.router.navigateByUrl('booking/view-booking');
  }

  get phoneNumber() {
    return this.bookingForm.get('phonenumber') as FormControl;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
    this.store.dispatch(initBooking());
  }
}
