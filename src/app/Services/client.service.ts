import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private _HttpClient: HttpClient) { }

  baseUrl: string = environment.baseUrl
  getClientsBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/clients`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/clients`, { params: params });
  }
  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/clients`, { params: params })
  }

  create(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/clients`, body)
  }

  delete(clientId: number) {
    return this._HttpClient.delete(
      `${this.baseUrl}admin/clients/${clientId}`
    );
  }
  update(clientId: number, body: any): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}admin/clients/${clientId}`,
      body
    );
  }

  RemoveBulk(ids: any): Observable<any> {
    return this._HttpClient.request('delete', `${this.baseUrl}admin/clients/bulk-delete`, { body: ids });
  }

  paginate(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/clients`,
      { params: params }
    );
  }

}
