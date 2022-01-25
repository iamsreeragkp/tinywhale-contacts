import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { StorageService } from '../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService, private toastrService: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!request?.url?.includes(environment.api_end_point)){
      return next.handle(request)
    }
    const token = this.storageService.getToken();
    const customReq = request.clone({
      setHeaders: {
        Authorization: `${token}`, // Setting header
      },
    });
    return next.handle(customReq).pipe(
      catchError(err => {
        throw err;
      })
    );
  }
}
