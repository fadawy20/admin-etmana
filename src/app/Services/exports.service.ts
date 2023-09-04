import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExportsService {
  baseUrl: string = environment.baseUrl;

  constructor(private _http: HttpClient) {}

  exportBulk(ids: any, apiEndPoint: string): Observable<any> {
    return this._http.get(`${this.baseUrl}${apiEndPoint}`, {
      responseType: 'blob',
      params: {
        'ids[]': ids,
      },
    });
  }
  exportGlobal(ids: any, apiEndPoint: string, param: any): Observable<any> {
    let params = param;
    if (ids.length > 0)
      params = {
        'ids[]': ids,
      };

    return this._http.get(`${this.baseUrl}${apiEndPoint}`, {
      responseType: 'blob',
      params: params,
    });

  }
}
