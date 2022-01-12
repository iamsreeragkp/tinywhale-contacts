import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from './shared/user.model';
import { HttpClient } from '@angular/common/http';
import { EndpointsType, ENDPOINTS_CONFIG } from 'src/app/configs/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    @Inject(ENDPOINTS_CONFIG) private endpoints: EndpointsType
  ) {}

  getMe(): Observable<User> {
    return this.http.get(this.endpoints.getMe).pipe(map((result: any) => new User(result.data.me)));
  }
}
