import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { StorageService } from '../../shared/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { EndpointsType, ENDPOINTS_CONFIG } from 'src/app/configs/endpoints.config';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Auth } from './store/auth.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private socialAuthService: SocialAuthService,
    @Inject(ENDPOINTS_CONFIG) private endpoints: EndpointsType
  ) {}

  private authApi = environment.api_end_point;

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

  signUpUser(payload: Auth): Observable<any> {
    return this.http.post(`${this.authApi}/auth/signup`, payload);
  }

  loginUser(payload: Auth): Observable<any> {
    return this.http.post(`${this.authApi}/auth/login`, payload);
  }

  checkDomainAvailability(subdomain: string): Observable<any> {
    return this.http.get(`${this.authApi}/store/check/${subdomain}`);
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

  public googleSignIn() {
    return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public googleSignOut() {
    return this.socialAuthService.signOut();
  }
}
