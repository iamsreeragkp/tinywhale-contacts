import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { getBooking } from '../../store/booking.actions';
import { IBookingState } from '../../store/booking.reducers';
import { getBookings } from '../../store/booking.selectors';

@Component({
  selector: 'app-table-booking-component',
  templateUrl: './table-booking-component.component.html',
  styleUrls: ['./table-booking-component.component.scss']
})
export class  TableBookingComponentComponent implements OnInit,OnDestroy {

  isMenuVisible=false;
  bookingData$: Observable<any>;
  ngUnsubscribe = new Subject<any>();
  bookingData:any;
  orderLineItem:any;
  constructor(private router:Router,private store: Store<IBookingState>) {
    this.store.dispatch(getBooking())
    this.bookingData$ = this.store.pipe(select(getBookings));
   }

  ngOnInit(): void {
    this.subscriptions();
  }

  subscriptions(){
    this.bookingData$
    .pipe(
      takeUntil(this.ngUnsubscribe),
      filter(val => !!val)
    )
    .subscribe(data => {
      if (data) {
        this.bookingData=data;
        for(let i=0;i<this.bookingData.length;i++){
          this.orderLineItem=this.bookingData[i].order_line_item;
        }
      } else {
        console.log(data?.error);
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
    this.ngUnsubscribe.next(true);
  }


  navigateToEdit(orderId:number){
    this.router.navigateByUrl(`/booking/edit-booking/${orderId}`);
  }

  visibleIndex = -1;
  showSubItem(ind:any) {
    if (this.visibleIndex === ind) {
      this.visibleIndex = -1;
    } else {
      this.visibleIndex = ind;
    }
  }

}
