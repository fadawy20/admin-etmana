import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReasonsService {
  baseUrl: string = environment.baseUrl

  constructor(private _httpClient: HttpClient) { }


  get(): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}admin/reasons?filters[type]=1`);
  }
  create(body: any): Observable<any> {
    return this._httpClient.post(`${this.baseUrl}admin/reasons?filters[type]=1`, body);
  }
  delete(id: number) {
    return this._httpClient.delete(`${this.baseUrl}admin/reasons?filters[type]=1/${id}`);
  }
  update(id: number, body: any): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}admin/reasons?filters[type]=1/${id}`, body);
  }
  paginate(params: any): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}admin/reasons?filters[type]=1`, { params: params });
  }
  getFilterColumn(params: any): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}admin/reasons`, { params: params });
  }


}
