import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth-service.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  country: string;
  headers: any;

  constructor(
    private _authService: AuthService
  ) {
    this.country = localStorage.getItem('Country') || 'EG';
    if (this.country == 'eg') {
      this.country = 'eg';
    } else {
      this.country = 'sa';
    }
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(request));
  }

  addAuthToken(request: HttpRequest<any>) {
    let header: any = {};
    if (request.url !== 'https://ipapi.co/json') {
      header['Country'] = this.country;
      header['x-timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    // console.log(request.url, 'this is request url ');


    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this._authService.getToken()}`,
        ...header,

      },


    })
  }
}
