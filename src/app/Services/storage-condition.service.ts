import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageConditionService {
  baseUrl: string = environment.baseUrl
  constructor(private _http:HttpClient) {}
  getStorageBySearch(params: any): Observable<any> {
    return this._http.get(
      `${this.baseUrl}admin/storage-conditions`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._http.get(`${this.baseUrl}admin/storage-conditions`, { params: params });
  }
  get(params:any):Observable<any>
  {
    return this._http.get(`${this.baseUrl}admin/storage-conditions`,{params:params});
  }

  paginate(params: any): Observable<any> {
    return this._http.get(`${this.baseUrl}admin/storage-conditions`,{ params: params });
  }
  create(body: any): Observable<any> {
    return this._http.post(`${this.baseUrl}admin/storage-conditions`, body)
  }

  delete(id: number) {
    return this._http.delete(`${this.baseUrl}admin/storage-conditions/${id}`);
  }
  update(id: number, body: any): Observable<any> {
    return this._http.put(`${this.baseUrl}admin/storage-conditions/${id}`, body);
  }
}
