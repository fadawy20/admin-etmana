import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailsImportedService {
  baseUrl: string = environment.baseUrl

  constructor(private _http:HttpClient) { }

  show(id:number):Observable<any>
  {
    return this._http.get(`${this.baseUrl}admin/products/import_logs/${id}`) ;
  }
  // deleteitem(id:number):Observable<any>
  // {
  //   return this._http.delete(`${this.baseUrl}admin/products/import_logs/${id}`) ;
  // }


}
