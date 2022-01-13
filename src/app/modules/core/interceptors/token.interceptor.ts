import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { StorageService } from '../../../shared/services/storage.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.storageService.getToken();
    const customReq = request.clone({
      setHeaders: {
        'x-auth-token': `Bearer ${token}`, // Setting header
      },
    });
    return next.handle(customReq).pipe(
      catchError(err => {
        // Catching http errors
        return of(err);
      })
    );
  }
}
