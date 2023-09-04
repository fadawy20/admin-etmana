import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AddressService {
  SERVER_URL: string = environment.baseUrl;

  constructor(private _httpClient: HttpClient) {}

  geCoutries(): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}countries`);
  }
  geGovern(id: number): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}governorates/${id}`);
  }
  geCities(id: number): Observable<any> {
    return this._httpClient.get(`${environment.baseUrl}cities/${id}`);
  }
  getAddresses(id:any): Observable<any> {
    return this._httpClient.get(`${this.SERVER_URL}admin/client-addresses/${id}`);
  }
  setCustomerAddress(data: any): Observable<any> {
    return this._httpClient.post(
      `${environment.baseUrl}admin/client-addresses`,
      data
    );
  }
  updatCustomerAddress(id: number, data: any): Observable<any> {
    return this._httpClient.put(
      `${environment.baseUrl}admin/client-addresses/${id}`,
      data
    );
  }

  deleteAddress(id: number): Observable<any> {
    return this._httpClient.delete(
      `${environment.baseUrl}admin/client-addresses/${id}`
    );
  }
}
