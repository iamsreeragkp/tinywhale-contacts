import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { BookingService } from '../../booking.service';
import { getBooking, getBookingList } from '../../store/booking.actions';
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
  orderLineItem: any;
  serviceData: any;
  classTimeRanges: any;
  filterForm!: FormGroup;

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

  threeDotsActions = ['Reshedule'];

  constructor(
    private router: Router,
    private store: Store<IBookingState>,
    private bookingService: BookingService,
    private fb: FormBuilder
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
  }

  ngOnInit(): void {
    this.subscriptions();
  }

  orderSession: any;
  bookData: any;
  subscriptions() {
    this.bookingData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        filter(val => !!val)
      )
      .subscribe(data => {
        if (data) {
          this.bookingData = data.bookingList;
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
      const productId = data?.service?.product_id;
      const status = data?.status;
      const payment = data?.payment;
      if (productId || status || payment) {
        this.store.dispatch(
          getBookingList({
            filters: {
              product_id: productId ? productId : '',
              payment_status: payment ? payment : '',
              event_status: status ? status : '',
            },
          })
        );
      }
    });
  }

  handleAction(event: string, index: number, orderId: any) {
    if (event === 'Reshedule') {
      this.router.navigateByUrl(`/booking/edit-booking/${orderId}`);
    }
  }

  getDropdownData() {
    this.bookingService
      .getServiceDropdown()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.serviceData = data?.data;
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

  get isFilterEmpty() {
    return this.filterForm.valid;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
