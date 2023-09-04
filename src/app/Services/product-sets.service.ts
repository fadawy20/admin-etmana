import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductSetsService {

  baseUrl: string = environment.baseUrl

  constructor(private _HttpClient: HttpClient) { }
  getProductsBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/product-sets`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/product-sets`, { params: params });
  }
  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/product-sets`, { params: params })
  }
  create(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/product-sets`, body)
  }

  delete(id: number) {
    return this._HttpClient.delete(
      `${this.baseUrl}admin/product-sets/${id}`
    );
  }
  update(id: number, body: any): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}admin/product-sets/${id}`,
      body
    );
  }

  paginate(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/product-sets`,
      { params: params }
    );
  }

  RemoveBulk(ids: any): Observable<any> {
    return this._HttpClient.request('delete', `${this.baseUrl}admin/product-sets/bulk-delete`, { body: ids });
  }

  getProductSet(id: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/product-sets/${id}`
    );
  }
}
