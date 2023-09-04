import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  baseUrl: string = environment.baseUrl

  constructor(private _HttpClient: HttpClient) { }

  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/colors`, { params: params })
  }
  create(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/colors`, body)
  }

  delete(id: number) {
    return this._HttpClient.delete(
      `${this.baseUrl}admin/colors/${id}`
    );
  }
  update(id: number, body: any): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}admin/colors/${id}`,
      body
    );
  }

  paginate(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/colors`,
      { params: params }
    );
  }

}
