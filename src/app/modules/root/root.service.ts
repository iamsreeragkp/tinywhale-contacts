import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RootService {
  private api = environment.api_end_point;

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get(`${this.api}/dashboard/dashboard-info`);
  }
}
