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
    return this.http.post(`${this.bookingApi}/booking/order`, payload);
  }

  getBookingById(orderId: any) {
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    const params = new HttpParams().set('business_id', businessId);
    return this.http.get(`${this.bookingApi}/booking/order/${orderId}`, { params: params });
  }

  getAllBookings() {
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    const params = new HttpParams().set('business_id', businessId);
    return this.http.get(`${this.bookingApi}/booking/order`, { params: params });
  }

  getServiceDropdown() {
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    const params = new HttpParams().set('business_id', businessId).set('product_type', 'CLASS');
    return this.http.get(`${this.bookingApi}/dashboard/service`, { params: params });
  }

  getBookingList(filters: any) {
    const {
      dashboardInfos: { businessId: business_id },
    } = this.authService.decodeUserToken();
    const params = new HttpParams({ fromObject: { business_id, ...filters } });
    return this.http.get(`${this.bookingApi}/booking/order`, { params });
  }

  getBookingDates(productId: any) {
    return this.http.get(`${this.bookingApi}/booking/filled-slots/${productId}`);
  }
}
