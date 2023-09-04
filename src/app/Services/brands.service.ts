import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  baseUrl: string = environment.baseUrl

  constructor(private _HttpClient: HttpClient) { }

  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/brands`, { params: params })
  }

  create(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/brands`, body)
  }
  getBrandsBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/brands`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/brands`, { params: params });
  }

  delete(id: number) {
    return this._HttpClient.delete(
      `${this.baseUrl}admin/brands/${id}`
    );
  }
  update(id: number, body: any): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}admin/brands/${id}`,
      body
    );
  }

  RemoveBulk(ids: any): Observable<any> {
    return this._HttpClient.request('delete', `${this.baseUrl}admin/brands/bulk-delete`, { body: ids });
  }

  paginate(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/brands`,
      { params: params }
    );
  }

  // scroll(params: any): Observable<any> {
  //   return this._HttpClient.get(
  //     `${this.baseUrl}admin/brands`,
  //     { params: params }
  //   );
  // }

}
