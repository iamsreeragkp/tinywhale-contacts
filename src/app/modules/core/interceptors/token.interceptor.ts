import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { StorageService } from '../../../shared/services/storage.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService, private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!request?.url?.includes(environment.api_end_point)) {
      return next.handle(request);
    }
    const token = this.storageService.getToken();
    const customReq = request.clone({
      setHeaders: {
        Authorization: `${token}`, // Setting header
      },
    });
    return next.handle(customReq).pipe(
      tap((res: any) => {
        const token = res?.headers?.get('X-Auth-Token');
        if (token) {
          this.storageService.setAccessToken(token);
        }
      }),
      catchError(err => {
        if (err?.status === 401) {
          this.auth.onlogout();
        }
        throw err;
      })
    );
  }
}
