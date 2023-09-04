import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl: string = environment.baseUrl;


  constructor(private http: HttpClient) { }
  updateStatus(id: number, data: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}admin/orders/${id}/status`, data)
  }
  updateItemStatus(id: number, data: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}admin/orders/${id}/shipment-product/status`, data)
  }
  updateItemStatusForRtoReason(id: number, data: any): Observable<any> {
    return this.http.post(`${environment.baseUrl}admin/orders/${id}/shipment-products/status`, data)
  }

  getCities(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}admin/country/${id}/cities`)

  }
  getBrands(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/brands`, { params: params })
  }
  getOrdersBySearch(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/orders/list`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/orders/list`, { params: params });
  }
  getCustomers(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/clients`, { params: params });
  }
  filterCustomers(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/clients`, { params: params });
  }
  paginateCustomer(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/clients`, { params: params });
  }
  paginateProducts(Productparams: any): Observable<any> {
    return (
      this.http.get(`${this.baseUrl}admin/product/seller-variations/search`,
        { params: Productparams }
      )
    );
  }

  getProducts(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/product/seller-variations/search`,
      { params: params }
    );
  }

  geCoutries(): Observable<any> {
    return this.http.get(`${environment.baseUrl}countries`)
  }
  geGovern(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}governorates/${id}`)

  }
  geCities(id: number): Observable<any> {
    return this.http.get(`${environment.baseUrl}cities/${id}`)

  }

  getCustomerAddress(id: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/client-addresses/${id}`);
  }
  setCustomerAddress(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}admin/client-addresses`, data);
  }
  updatCustomerAddress(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}admin/client-addresses/${id}`, data);
  }
  updatCustomerAddressInDetails(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}admin/orders/address/${id}/update`, data);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}admin/client-addresses/${id}`);
  }

  getPaymentMethod(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/payment-methods`);
  }


  getOrderSummary(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}admin/orders/checkout/summary`, data);
  }

  placeOrder(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}admin/orders/checkout`, data);
  }

  getListOrders(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/orders/list`, { params: params });
  }

  paginateOrders(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/orders/list`, { params: params });
  }
  showOrders(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/orders/${id}`);
  }

  getClientOrdersById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/clients/ ${id}/orders`)
  }

  getReasonsOfCancellationAndRto() : Observable<any>{
    return this.http.get(`${this.baseUrl}admin/reasons`, {params : {"filters[type]" : 4}})
  }
}
