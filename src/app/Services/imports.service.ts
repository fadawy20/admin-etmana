import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImportsService {
  baseUrl: string = environment.baseUrl;

  constructor(
    private _httpClient: HttpClient,
  ) {}

  get(params: any): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}admin/products/import_logs`, {
      params: params,
    });
  }

  getData(id: number): Observable<any> {
    return this._httpClient.get(
      `${this.baseUrl}admin/products/import-new/${id}`,
      { responseType: 'blob' }
    );
  }

  paginate(params: any): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}admin/products/import_logs`, {
      params: params,
    });
  }
}
