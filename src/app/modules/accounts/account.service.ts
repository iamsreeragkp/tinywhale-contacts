import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/shared/services/storage.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { AccountAddPayload } from './store/account.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private paymentApi = environment.api_end_point;

  constructor(private http: HttpClient, private authService: AuthService) {}

  addPayments(payload: AccountAddPayload): Observable<any> {
    return this.http.post(`${this.paymentApi}/dashboard/payment-info`, payload);
  }

  getPayment() {
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    return this.http.get(`${this.paymentApi}/account/account-info/${businessId}`);
  }

  kycRegister(){
    return this.http.get(`${this.paymentApi}/account/kyc`)
  }
}
