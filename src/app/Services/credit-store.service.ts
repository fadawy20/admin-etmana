import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CreditStoreService {
  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }
  get(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/store-credits`, {
      params: params,
    });
  }
  paginate(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/store-credits`, {
      params: params,
    });
  }

  getCreditBySearch(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/store-credits`, {
      params: params,
    });
  }
  getFilterColumn(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/store-credits`, {
      params: params,
    });
  }

  getReasons(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/reasons?filters[type]=2`);
  }
  getReasonsForReject(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/reasons?filters[type]=3`);
  }
  getBanks(): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/banks`);
  }
  changeStatus(id: number, data: any): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}admin/store-credits/${id}/approve`,
      data
    );
  }

  CreateStoreCredit(data: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}admin/store-credits`, data);
  }
  showStoreCredit(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}admin/store-credits/${id}`);
  }
  updateStoreCredit(id: number, data: any): Observable<any> {
    return this.http.put(
      `${environment.baseUrl}admin/store-credits/${id}`,
      data
    );
  }
  deleteStoreCredit(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}admin/store-credits/${id}`);
  }

  orderDetails(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}admin/orders/${id}`);
  }
  orderDetailsBySerial(id: number): Observable<any> {
    return this.http.get(
      `${environment.baseUrl}admin/orders/serial-number/${id}`
    );
  }

  getEtmanaCredit(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}admin/clients/${id}/store-credits`);

  }
}
