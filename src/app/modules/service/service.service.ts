import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { ProductPayload, ServiceListFilter } from './shared/service.interface';

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
    return this.http.post(`${this.api}/dashboard/service`, {
      ...payload,
      business_id,
    });
  }

  getService(productId: number) {
    return this.http.get(`${this.api}/dashboard/service/${productId}`);
  }

  getServiceList(filters: ServiceListFilter) {
    const {
      dashboardInfos: { businessId: business_id },
    } = this.authService.decodeUserToken();
    const params = new HttpParams({ fromObject: { ...filters, business_id } });
    return this.http.get(`${this.api}/dashboard/service`, { params });
  }
}
