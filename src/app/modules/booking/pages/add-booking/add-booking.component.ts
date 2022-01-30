import { Location } from '@angular/common';

import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/modules/auth/auth.service';
import { BookingService } from '../../booking.service';
import { addBooking } from '../../store/booking.actions';
import { BookingType } from '../../store/booking.interface';
import { IBookingState } from '../../store/booking.reducers';
@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss'],
})
export class AddBookingComponent implements OnInit {
  bookingForm!: FormGroup;
  options = {
    format: 'yyyy-MM-dd',
  };
  classData:any;
  classTimeRanges:any;
  times:any;
  classTimerangeId:any;
  constructor(
    private authService: AuthService,
    private store: Store<IBookingState>,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    public location: Location,
    private bookingService:BookingService
  ) {
    this.bookingForm = this.createBookingForm();
    this.getDropdownData();
  }

  ngOnInit(): void {
    this.bookingForm.get('service')?.valueChanges?.subscribe((val)=>{
      const currClass=this.classData?.find((item:any)=>item?.product_id===val);
      if(currClass?.class?.class_time_ranges){
        this.times=currClass?.class?.class_time_ranges;
        this.classTimerangeId=this.times[0]?.class_time_range_id;
      }
    })
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

  getDropdownData(){
    this.bookingService.getServiceDropdown().subscribe((data:any)=>{
      this.classData=data?.Classes;
      this.classTimeRanges=data?.Classes;
    })
  }

  onBooking() {
    const { email, phonenumber, customername, service, date, slot, payment } =
      this.bookingForm.value;
    const bookingPayload = {
      email: email,
      mobile_number: phonenumber,
      name: customername,
      date_time_range: { date: this.formatDate(date), class_time_range_id: this.classTimerangeId },
      product_id: service,
      booking_type: BookingType.BUSINESS_OWNER,
      platform: payment,
    };
    this.store.dispatch(addBooking({bookingData:bookingPayload}));
    window.location.reload();
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

}
