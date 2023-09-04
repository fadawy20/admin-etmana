import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {
  baseUrl: string = environment.baseUrl

  constructor(private _http:HttpClient) { }
  getTaxes(){
    return this._http.get(`${this.baseUrl}admin/settings/tax-configuration`)
  }
  creatTax(data:any){
    return this._http.post(`${this.baseUrl}admin/settings/tax-configuration/`,data);
  }
}
