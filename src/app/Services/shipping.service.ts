import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ShippingService {


  baseUrl: string = environment.baseUrl

  constructor(private http: HttpClient) { }
  getShippingBySearch(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/shipping-fees`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/shipping-fees`, { params: params });
  }
  get(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/shipping-fees`,
      { params: params }
    );
  }
  paginate(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/shipping-fees`,
      { params: params }
    );
  }

  geCoutries(): Observable<any> {
    return this.http.get(`${environment.baseUrl}countries`)
  }

  geCities(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}admin/country/${id}/cities`)
  }
  getCustomers(): Observable<any> {
    return this.http.get(`${environment.baseUrl}admin/clients`)


  }
  CreateShipping(data: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}admin/shipping-fees`, data)


  }
  showShipping(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}admin/shipping-fees/${id}`)


  }
  updatShipping(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.baseUrl}admin/shipping-fees/${id}`, data)


  }
  deleteShipping(id: number): Observable<any> {
    return this.http.delete(`${environment.baseUrl}admin/shipping-fees/${id}`)


  }
}
