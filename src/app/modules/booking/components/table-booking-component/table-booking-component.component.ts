import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { BookingService } from '../../booking.service';
import { AppConfigType, APP_CONFIG } from 'src/app/configs/app.config';
import { getBooking, getBookingList, initBooking } from '../../store/booking.actions';
import { IBookingState } from '../../store/booking.reducers';
import { getBookingListStatus, getBookings } from '../../store/booking.selectors';

@Component({
  selector: 'app-table-booking-component',
  templateUrl: './table-booking-component.component.html',
  styleUrls: ['./table-booking-component.component.scss'],
})
export class TableBookingComponentComponent implements OnInit, OnDestroy {
  isMenuVisible = false;
  bookingData$: Observable<any>;
  ngUnsubscribe = new Subject<any>();
  bookingData: any;
  bookingsCount?: number;
  orderLineItem: any;
  serviceData: any;
  classTimeRanges: any;
  filterForm!: FormGroup;
  page: number;
  limit: number;
  filterStatus: any;
  isFilter =false;

  status = [
    {
      title: 'Upcoming',
      value: 'UPCOMING',
    },
    {
      title: 'Completed',
      value: 'COMPLETED',
    },
  ];
  payment = [
    {
      title: 'Paid',
      value: 'PAID',
    },
    {
      title: 'Unpaid',
      value: 'UNPAID',
    },
  ];

  threeDotsActions = ['Reschedule'];
  serviceList: any;
  checkVal: any;

  constructor(
    private router: Router,
    private store: Store<IBookingState>,
    private bookingService: BookingService,
    private fb: FormBuilder,
    @Inject(APP_CONFIG) private appConfig: AppConfigType,
    private _route: ActivatedRoute,
  ) {
    this.bookingData$ = store.pipe(
      select(getBookingListStatus),
      takeUntil(this.ngUnsubscribe),
      filter(val => !!val)
    );

    this.store.dispatch(getBookingList({ filters: {} }));
    this.bookingData$ = this.store.pipe(select(getBookingListStatus));
    this.getDropdownData();
    this.filterForm = this.createFilterForm();
    this.page = appConfig.defaultStartPage;
    this.limit = appConfig.defaultPageLimit;
    store.dispatch(getBookingList({ filters: { page: this.page, limit: this.limit } }));
  }

  ngOnInit(): void {
    this.subscriptions();
    this._route.queryParamMap.subscribe(param => {
      const status = param.get('status');
      const payment = param.get('payment');
      if (status && this.status.some(option => option.value === status)) {
        this.filterForm.get('status')?.patchValue(status);
      }
      if (payment && this.payment.some(option => option.value === payment)) {
        this.filterForm.get('payment')?.patchValue(payment);
      }
    });
    this.clearParam();
  }

  clearParam() {
    if (this._route.snapshot.queryParams?.['filter']) {
      this.router.navigate(['.'], { relativeTo: this._route });
    }
  }

  orderSession: any;
  bookData: any;
  isLoadMore = false;
  validateCount(count: any) {
    console.log(count, 'count');

    if (count >= 5) {
      this.isLoadMore = true;
      console.log(this.isLoadMore, 'Display loadmore');
    }
  }
  subscriptions() {
    this.bookingData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        console.log(data,"naveens");
        
        if (data) {
          this.checkVal = 1;
          this.bookingData = this.formatDatas(data);
          this.bookingsCount = data.bookingsCount;
          this.validateCount(this.bookingsCount);
          for (let i = 0; i < this.bookingData?.length; i++) {
            this.orderLineItem = this.bookingData[i].order_line_item;
          }
          for (let i = 0; i < this.bookingData?.length; i++) {
            this.orderSession = this.bookingData[i].order_session;
          }
        } else {
          console.log(data?.error);
        }
      });

    this.filterForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.checkVal = 0;
      this.resetPage();
      // const productId = data?.service?.product_id;
      const productId = data?.service;
      const status = data?.status;
      const payment = data?.payment;
      this.store.dispatch(
        getBookingList({
          filters: {
            product_id: productId ? productId : '',
            payment_status: payment ? payment : '',
            event_status: status ? status : '',
            page: this.page,
            limit: this.limit,
          },
        })
      );
    });
  }

  handleAction(event: string, index: number, orderId: any) {
    if (event === 'Reschedule') {
      this.router.navigateByUrl(`/booking/edit-booking/${orderId}`);
    }
  }
  getDropdownData() {
    this.bookingService
      .getServiceDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.serviceData = data?.data;
        this.serviceList = this.serviceData.map((data: any) => {
          return {
            title: data.title,
            value: data?.product_id,
          };
        });

        this.classTimeRanges = data?.Classes;
      });
  }

  createFilterForm() {
    // return new FormGroup({
    //   service: new FormControl(null, Validators.maxLength(0)),
    //   status: new FormControl(null, Validators.maxLength(0)),
    //   payment: new FormControl(null, Validators.maxLength(0)),
    // });
    return this.fb.group({
      service: [null, Validators.maxLength(0)],
      status: [null, Validators.maxLength(0)],
      payment: [null, Validators.maxLength(0)],
    });
  }

  clearFilter() {
    this.filterForm.reset();
  }

  navigateToEdit(orderId: number) {
    this.router.navigateByUrl(`/booking/edit-booking/${orderId}`);
  }

  visibleIndex = -1;
  showSubItem(ind: any) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }
  getCheckFilter(){
   if( this.filterForm?.get("service")?.value || this.filterForm?.get("status")?.value || this.filterForm?.get("payment")?.value ) {
    return true;
    }
    else{
      return false;
    }
  }

  onNavigateToList(id: any) {
    this.router.navigate([`../booking/status-booking/${id}`], { queryParams: { fromList: true } });
  }

  get isFilterEmpty() {
    return this.getCheckFilter();
  }

  convertToDate(dateString: string, timeString: string = '0000') {
    const dateArray = dateString.split('-');
    const date = new Date(+dateArray[0], +dateArray[1] - 1, +dateArray[2]);
    const minutes = parseInt(timeString.slice(2));
    const hours = parseInt(timeString.slice(0, 2));
    const totalTime = new Date(date.getTime() + minutes * 60000 + hours * 60 * 60000);
    return totalTime;
  }

  formatDate(date: Date) {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = date.getDate();

    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    const year = date.getFullYear();
    const yearString = "'" + year.toString().slice(2);
    return `${day} ${monthName} ${yearString}`;
  }

  filterEvent(event: any) {
    if (event === true) {
      this.checkVal = 0;
      this.filterForm.reset();
    }
  }
  displaySessions(number: number) {
    if (number === 1) {
      return `(1 session)`;
    } else {
      return `(${number ?? '-'} sessions)`;
    }
  }
  resetPage() {
    this.page = this.appConfig.defaultStartPage;
    this.limit = this.appConfig.defaultPageLimit;
  }

  loadMore() {
    this.checkVal = 0;
    this.limit += this.appConfig.defaultPageLimit;
    this.fetchBookingList();
  }

  fetchBookingList() {
    const { product_id, status, payment } = this.filterForm.value;
    const filterObj = {
      product_id: product_id ? product_id : '',
      payment_status: payment ? payment : '',
      event_status: status ? status : '',
    };
    this.store.dispatch(
      getBookingList({
        filters: { filterObj, page: this.page, limit: this.limit },
      })
    );
  }

  formatDatas(data: any) {
    
    const formattedData = data?.["bookingList"].map((booking: any) => {
      if (booking?.["product_type"] === "CLASS") {
        const displayDate = booking?.["date_time_col"]?.["date_time"];
        const totalSessions = booking?.["session_date_time"]?.length;
        const status = booking?.["date_time_col"]?.["status"]
        let sessionNo: number;
        const formattedDisplayDate = this.formatDate(this.convertToDate(displayDate?.["date"], displayDate?.["s_time"]));
        if (booking?.["session_date_time"]?.length > 1) {
          const index = booking?.["session_date_time"]?.findIndex((date: any) => JSON.stringify(date) === JSON.stringify(displayDate))
          sessionNo = index + 1;
        }
        else {
          sessionNo = 1;
        }
        return {
          ...booking,
          session_to_display: {
            formattedDisplayDate,
            sessionNo,
            totalSessions,
            status
          }
        }
      }
      else {
        return {
          ...booking
        }
      }

    })
    return formattedData
  }

  displayName(firstName: string, lastName: string) {
    if (firstName || lastName) {
      return (firstName ?? '') + ' ' + (lastName ?? '')
    }
    else {
      return null
    }

  }


  ngOnDestroy() {
    this.store.dispatch(initBooking());
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
