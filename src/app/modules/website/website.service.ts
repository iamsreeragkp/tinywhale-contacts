import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { BusinessEditPayload } from './store/website.interface';

@Injectable({
  providedIn: 'root',
})
export class WebsiteService {
  private businessApi = environment.api_end_point;

  constructor(private http: HttpClient, private authService: AuthService) {}

  addBusinessInfo(payload: BusinessEditPayload): Observable<any> {
    return this.http.post(`${this.businessApi}/dashboard/business-info`, payload);
  }

  getBusiness() {
    return this.http.get(`${this.businessApi}/dashboard/business-info`);
  }
}
