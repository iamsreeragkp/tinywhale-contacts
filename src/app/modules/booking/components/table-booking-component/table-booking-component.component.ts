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
  defaultFilter: any = null;
  filterStatus: any;

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

  constructor(
    private router: Router,
    private store: Store<IBookingState>,
    private bookingService: BookingService,
    private fb: FormBuilder,
    @Inject(APP_CONFIG) private appConfig: AppConfigType,
    private _route: ActivatedRoute
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
      this.defaultFilter = param.get('filter');
      if (this.defaultFilter) {
        const filter = [
          {
            title: 'Upcoming',
            value: 'UPCOMING',
          },
        ];
        this.filterForm.get('status')?.patchValue('UPCOMING');
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
    if (count >= 5) {
      this.isLoadMore = true;
    }
  }
  subscriptions() {
    this.bookingData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data) {
          this.formatData(data);
          this.bookingData = this.formatData(data);
          this.bookingsCount = data.bookingsCount;
          this.validateCount(this.bookingsCount);
          for (let i = 0; i < this.bookingData.length; i++) {
            this.orderLineItem = this.bookingData[i].order_line_item;
          }
          for (let i = 0; i < this.bookingData.length; i++) {
            this.orderSession = this.bookingData[i].order_session;
          }
        } else {
          console.log(data?.error);
        }
      });

    this.filterForm.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
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

  onNavigateToList(id: any) {
    this.router.navigate([`../booking/status-booking/${id}`], { queryParams: { fromList: true } });
  }

  get isFilterEmpty() {
    return this.filterForm.valid;
  }

  formatData(data: any) {
    const sortedBookingList = data['bookingList'].map((booking: any) => {
      const timingArray: any[] = [];
      let displaySession: any = null;

      if (booking['order_session'].length > 1) {
        const sortedOrderList = booking['order_session'].slice().sort((a: any, b: any) => {
          return (
            +new Date(
              this.convertToDate(
                a['session']['date'],
                a['session']['class_time_range']['start_time']
              )
            ) -
            +new Date(
              this.convertToDate(
                a['session']['date'],
                a['session']['class_time_range']['start_time']
              )
            )
          );
        });

        sortedOrderList.map((order: any, index: number, data: any) => {
          const sessionData = this.createDataStructure(order, index, data.length);
          timingArray.push(sessionData);
        });

        const upcomingSessions = timingArray.filter(session => {
          return session.difference < 0;
        });

        if (upcomingSessions.length) {
          displaySession = upcomingSessions.reduce(function (prev, current) {
            if (+current.difference > +prev.difference) {
              return current;
            } else {
              return prev;
            }
          });
        } else {
          displaySession = timingArray.reduce(function (prev, current) {
            if (+current.difference > +prev.difference) {
              return current;
            } else {
              return prev;
            }
          });
        }
        return {
          ...booking,
          session_to_display: displaySession,
        };
      } else {
        const order = booking['order_session'][0];
        const sessionData = this.createDataStructure(order, 0);

        return {
          ...booking,
          session_to_display: sessionData,
        };
      }
    });

    return sortedBookingList;
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
    const yearString = '`' + year.toString().slice(2);
    return `${day} ${monthName} ${yearString}`;
  }

  createDataStructure(order: any, index: number, noOfSessions = 1) {
    const date = order['session']['date'];
    const exactDate = this.convertToDate(
      order['session']['date'],
      order['session']['class_time_range']['start_time']
    );
    const difference = +new Date() - +exactDate;
    const status = difference < 0 ? 'upcoming' : 'completed';
    const sessionNo = index + 1;
    const totalSessions = noOfSessions;
    return {
      displayDate: this.formatDate(exactDate),
      difference,
      status,
      sessionNo,
      totalSessions,
    };
  }

  filterEvent(event: any) {
    if (event === true) {
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

  ngOnDestroy() {
    this.store.dispatch(initBooking());
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
