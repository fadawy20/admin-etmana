import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
export interface CMS {
  data: any,
  links: any,
  mata: any
}

@Injectable({
  providedIn: 'root'
})
export class CmsService {
  baseUrl: string = environment.baseUrl
  constructor(private _DataPipe: DatePipe, private _httpClient: HttpClient) { }

  // STORE CMS
  storeCms(body: {}): Observable<any> {
    return this._httpClient.post<any>(`${this.baseUrl}admin/cms`, body, {})
  }
  // get cms
  getCms(): Observable<CMS> {
    return this._httpClient.get<CMS>(`${this.baseUrl}admin/cms`)
  }
  // DELETE CMS
  deleteCms(id: number): Observable<string> {
    const url = `${this.baseUrl}admin/cms/${id}`
    return this._httpClient.delete<string>(url)
  }

  // GET CMS BY ID
  // https://api-staging.etmana.com/api/admin/cms/:id
  getCmsById(id: number): Observable<any> {
    return this._httpClient.get(`${this.baseUrl}admin/cms/${id}`)
  }

  // EDIT CMS by ID
  // https://api-staging.etmana.com/api/admin/cms/:id
  updateCms(id: any, body: any): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}admin/cms/${id}`, body)
  }








}
