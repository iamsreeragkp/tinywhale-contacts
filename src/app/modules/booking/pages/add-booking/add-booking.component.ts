import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss'],
})
export class AddBookingComponent implements OnInit {
  bookingForm!: FormGroup;


  constructor() {
    this.bookingForm = this.createBookingForm();
  }

  ngOnInit(): void {}

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

  onBooking() {
    const { email, phonenumber, customername, service, date, slot, payment } = this.bookingForm.value;
    const bookingPayload = {
      email,
      phonenumber,
      customername,
      service,
      date,
      slot,
      payment,
    };
    console.log('boobking payload',bookingPayload);

  }
}
