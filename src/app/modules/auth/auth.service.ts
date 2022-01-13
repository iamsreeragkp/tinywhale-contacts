import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from '../../shared/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { EndpointsType, ENDPOINTS_CONFIG } from 'src/app/configs/endpoints.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    @Inject(ENDPOINTS_CONFIG) private endpoints: EndpointsType
  ) {}

  isLoggedIn(): boolean {
    try {
      const token = this.storageService.getToken();
      if (token) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  signUp(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http
      .post(this.endpoints.signUp, {
        email,
        password,
        firstName,
        lastName,
      })
      .pipe(
        map((response: any) => {
          return !response.errors ? response.data.signup : response;
        })
      );
  }

  logIn(
    email: string,
    password: string
  ): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http
      .post(this.endpoints.logIn, {
        email,
        password,
      })
      .pipe(
        map((response: any) => {
          if (!response.errors) {
            const loginData = response.data.login;
            const { accessToken, refreshToken } = loginData;
            this.storageService.setCookie('accessToken', accessToken);
            this.storageService.setCookie('refreshToken', refreshToken);
            // this.utilsService.showSnackBar("Nice! Let's create some heroes", 'info-snack-bar');
            return loginData;
          } else {
            return response;
          }
        })
      );
  }
}
