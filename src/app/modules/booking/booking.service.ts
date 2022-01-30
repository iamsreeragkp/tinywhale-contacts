import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingApi = environment.api_end_point;

  constructor(private http: HttpClient, private authService: AuthService) {}

  addBooking(payload: any) {
    return this.http.post(`${this.bookingApi}/booking/create`, payload);
  }

  getBookingById(bookingId: any) {
    return this.http.get(`${this.bookingApi}/booking/${bookingId}`);
  }

  getAllBookings() {
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    return this.http.get(`${this.bookingApi}/booking/${businessId}`);
  }

  getServiceDropdown() {
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    const params = new HttpParams().set('business_id', businessId).set('product_type', 'CLASS');
    return this.http.get(`${this.bookingApi}/dashboard/service`, { params: params });
  }
}
