import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IBookingState } from '../../store/booking.reducers';
import { getBookingInfo } from '../../store/booking.selectors';

@Component({
  selector: 'app-status-booking',
  templateUrl: './status-booking.component.html',
  styleUrls: ['./status-booking.component.scss']
})
export class StatusBookingComponent implements OnInit {

  statusData:any;
  settledInvoice=true;
  orderId!:number;

  constructor(private router:Router,private store: Store<IBookingState>,) {
    this.store.select(getBookingInfo).subscribe((data:any)=>{
      this.statusData=data?.data;
      this.orderId=this.statusData?.order?.order_id;
    })
  }

  ngOnInit(): void {
    setTimeout(()=>{
      this.settledInvoice=false;
    },1000)
  }

  navigateToEdit(){
    this.router.navigateByUrl(`/booking/edit-booking/${this.orderId}`);
  }

  getDayName(date:any){
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(date);
    const dayName = days[d.getDay()];
    return dayName;
  }

}
