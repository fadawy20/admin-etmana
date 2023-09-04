import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  baseUrl: string = environment.baseUrl

  constructor(private _HttpClient: HttpClient) { }

  getPayments(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/order/item-list`,
      { params: params }
    );
  }
}
