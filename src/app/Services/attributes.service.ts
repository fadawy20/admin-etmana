import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable  } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  baseUrl: string = environment.baseUrl

  constructor(private _HttpClient: HttpClient) { }
  getAttributesBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/attributes`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/attributes`, { params: params });
  }
  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/attributes`, { params: params })
  }
  create(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/attributes`, body)
  }

  delete(id: number) {
    return this._HttpClient.delete(
      `${this.baseUrl}admin/attributes/${id}`
    );
  }
  update(attId: number, body: any): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}admin/attributes/${attId}`,
      body
    );
  }

  paginate(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/attributes`,
      { params: params }
    );
  }

  getAttValue(id: number) {
    return this._HttpClient.get(
      `${this.baseUrl}admin/attributes/${id}`
    );
  }

  createValue(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/attribute-values`, body)
  }

  updateValue(attValueId: number, body: any): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}admin/attribute-values/${attValueId}`,
      body
    );
  }

  deleteValue(id: number) {
    return this._HttpClient.delete(
      `${this.baseUrl}admin/attribute-values/${id}`
    );
  }
  // deletItems(data:any[]):Observable<any>
  // {
  //   return forkJoin(
  //     data.map((user)=>
  //       this._HttpClient.delete( `${this.baseUrl}admin/attribute-values/${user.id}`)
  //     )
  //   )
  // }

  RemoveBulk(ids: any): Observable<any> {
    return this._HttpClient.request('delete', `${this.baseUrl}admin/attributes/bulk-delete`, { body: ids });
  }

}
