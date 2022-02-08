import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  private api = environment.api_end_point;

  constructor(private http: HttpClient) {}

  getDashboard(filters: any) {
    const params = new HttpParams({ fromObject: { ...filters } });
    return this.http.get(`${this.api}/dashboard/dashboard-info`, { params });
  }

  publishWebsite() {
    return this.http.post(`${this.api}/dashboard/publish-website`, {});
  }
}
