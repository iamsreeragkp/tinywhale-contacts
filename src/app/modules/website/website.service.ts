import { HttpClient, HttpParams } from '@angular/common/http';
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
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId: business_id },
    } = userData;
    return this.http.post(`${this.businessApi}/dashboard/business-info`, {
      ...payload,
      business_id,
    });
  }

  uploadImage(images: any) {
    return this.http.post(`${this.businessApi}/utils/signedurl/put`, images);
  }

  uploadImageToS3(url: any, file: any) {
    console.log('url', url);

    // const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.put(url, file);
  }

  getBusiness() {
    console.log('reached');
    const userData = this.authService.decodeUserToken();
    const {
      dashboardInfos: { businessId },
    } = userData;
    return this.http.get(`${this.businessApi}/dashboard/business-info/${businessId}`);
  }

  // if query params

  public getBusi(id: any) {
    let param1 = new HttpParams().set('id', id);
    return this.http.get(`${this.businessApi}/dashboard/business-info`, { params: param1 });
  }
}
