import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class
ProductsService {

  baseUrl: string = environment.baseUrl

  constructor(private _HttpClient: HttpClient) { }

  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/products`, { params: params })
  }
  toggleStatus(data: any): Observable<any> {
    return this._HttpClient.patch(
      `${this.baseUrl}admin/products/bulk-active-update`,
      data
    );
  }
  toggleSingleStatus(id:number,data: any): Observable<any> {
    return this._HttpClient.patch(
      `${this.baseUrl}admin/products/toggle/${id}`,
      data
    );
  }

  getBrands(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/brands`)
  }
  getCategories(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/categories`)
  }
  getSubCategories(id:any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/categories/${id}`)
  }
  parentCategories(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/categories/parents`)
  }
  show(id: number): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/products/${id}`)
  }

  updateBulkStatus(data:any):Observable<any>
  {
    return this._HttpClient.patch(
      `${this.baseUrl}admin/products/bulk-status-update`,
      data
    );
  }

  getProductsBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/products`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/products`, { params: params });
  }


  paginate(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/products`,
      { params: params }
    );
  }

  getAttributes(attributeId: number) {
    return this._HttpClient.get(
      `${this.baseUrl}admin/product-sets/${attributeId}`,
    );
  }

  getStorageConditions(): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/storage-conditions`)
  }

  delete(id:any): Observable<any>{
    return this._HttpClient.delete(`${this.baseUrl}admin/products/${id}`)
  }

}
