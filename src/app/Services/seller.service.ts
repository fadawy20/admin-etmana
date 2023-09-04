import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SellerService {


  baseUrl: string = environment.baseUrl

  constructor(private http: HttpClient) { }
  getSellersBySearch(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/sellers`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/sellers`, { params: params });
  }
  get(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/sellers`,
      { params: params }
    );
  }
  paginate(params: any): Observable<any> {
    return this.http.get(
      `${this.baseUrl}admin/sellers`,
      { params: params }
    );
  }

  toggleSingleStatus(id:number,data: any): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}admin/sellers/toggle/${id}`,
      data
    );
  }

  uploadImage(data: any):Observable<any> {

    return this.http.post(`${environment.baseUrl}admin/upload-media`,data)
  }
  geCoutries():Observable<any>
  {
    return this.http.get(`${environment.baseUrl}countries`)
  }
  geGovern(id:number):Observable<any>
  {
    return this.http.get(`${environment.baseUrl}governorates/${id}`)

  }
  geCities(id:number):Observable<any>
  {
    return this.http.get(`${environment.baseUrl}cities/${id}`)

  }
  getSellers():Observable<any>
  {
    return this.http.get(`${environment.baseUrl}admin/sellers`)


  }
  CreateSellers(data:any):Observable<any>
  {
    return this.http.post(`${environment.baseUrl}admin/sellers`,data)


  }
  showSellers(id:number):Observable<any>
  {
    return this.http.get(`${environment.baseUrl}admin/sellers/${id}`)


  }
  updatSeller(id:number,data:any):Observable<any>
  {
    return this.http.put(`${environment.baseUrl}admin/sellers/${id}`,data)


  }
  deleteSeller(id:number):Observable<any>
  {
    return this.http.delete(`${environment.baseUrl}admin/sellers/${id}`)


  }
}
