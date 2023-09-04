import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { TreeNode } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl: string = environment.baseUrl

  constructor(private _HttpClient: HttpClient) { }

  getParents() {
    return this._HttpClient.get<any>(`${this.baseUrl}admin/categories/parents`)
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }
  getParentByObs(): Observable<any> {
    return this._HttpClient.get<any>(`${this.baseUrl}admin/categories/parents`)

  }

  getChilds(id: number) {
    return this._HttpClient.get<any>(`${this.baseUrl}admin/categories/${id}`)
      .toPromise()
      .then(res => res.data);
  }
  getChildByObs(id: number) {
    return this._HttpClient.get<any>(`${this.baseUrl}admin/categories/${id}`)
  }
  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/categories`, { params: params })
  }
  create(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/categories`, body)
  }

  delete(id: number) {
    return this._HttpClient.delete(
      `${this.baseUrl}admin/categories/${id}`
    );
  }
  update(id: number, body: any): Observable<any> {
    return this._HttpClient.put(
      `${this.baseUrl}admin/categories/${id}`,
      body
    );
  }

  // paginate(params: any): Observable<any> {
  //   return this._HttpClient.get(
  //     `${this.baseUrl}admin/categories`,
  //     { params: params }
  //   );
  // }

  scroll(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/categories`,
      { params: params }
    );
  }

}
