import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {


  private bookingApi=environment.api_end_point;

  constructor(private http:HttpClient) {}


  addBooking(){

  }

  getBookingById(){

  }




}
