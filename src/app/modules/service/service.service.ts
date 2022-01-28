import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { ProductPayload } from './shared/service.interface';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  api = environment.api_end_point;

  constructor(private authService: AuthService, private http: HttpClient) {}

  addServiceInfo(payload: ProductPayload): Observable<any> {
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId: business_id },
    } = userData;
    return this.http.post(`${this.api}/dashboard/business-info`, {
      ...payload,
      business_id,
    });
  }

  getService() {
    console.log('reached');
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    return this.http.get(`${this.api}/dashboard/business-info/${businessId}`);
  }
}
