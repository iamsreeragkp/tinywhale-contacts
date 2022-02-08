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
    return this.http.post(`${this.api}/dashboard/service`, payload);
  }

  getService(productId: number) {
    return this.http.get(`${this.api}/dashboard/service/${productId}`);
  }

  getServiceList(filters: ServiceListFilter) {
    const params = new HttpParams({ fromObject: { ...filters } });
    return this.http.get(`${this.api}/dashboard/service`, { params });
  }

  visibilityChange(product_id: number, payload: any) {
    return this.http.patch(`${this.api}/dashboard/service/${product_id}`, payload);
  }

  deleteService(product_id: number) {
    return this.http.delete(`${this.api}/dashboard/service/${product_id}`);
  }
}
