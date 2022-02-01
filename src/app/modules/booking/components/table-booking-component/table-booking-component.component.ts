import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { BookingService } from '../../booking.service';
import { getBooking } from '../../store/booking.actions';
import { IBookingState } from '../../store/booking.reducers';
import { getBookings } from '../../store/booking.selectors';

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
      value: 'Upcoming'
    },
    {
      title: 'Completed',
      value: 'Completed'

    },
  ];
  payment = [
    {
      title: 'Paid',
      value: 'Paid'

    },
    {
      title: 'Unpaid',
      value: 'Unpaid'

    },
  ];

  threeDotsActions = ['Reshedule'];

  constructor(
    private router: Router,
    private store: Store<IBookingState>,
    private bookingService: BookingService
  ) {
    this.store.dispatch(getBooking());
    this.bookingData$ = this.store.pipe(select(getBookings));
    this.getDropdownData();
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
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
          this.bookingData = data;
          for (let i = 0; i < this.bookingData.length; i++) {
            this.orderLineItem = this.bookingData[i].order_line_item;
          }
        } else {
          console.log(data?.error);
        }
      });
    this.filterForm.valueChanges.subscribe(data => console.log(data));
  }

  handleAction(event: string, index: number, orderId: any) {
    if (event === 'Reshedule') {
      this.router.navigateByUrl(`/booking/edit-booking/${orderId}`);
    }
  }

  getDropdownData() {
    this.bookingService.getServiceDropdown().subscribe((data: any) => {
      this.serviceData = data?.data;
      this.classTimeRanges = data?.Classes;
    });
  }

  createFilterForm() {
    return new FormGroup({
      service: new FormControl(''),
      status: new FormControl(''),
      payment: new FormControl(''),
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
  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }
}
