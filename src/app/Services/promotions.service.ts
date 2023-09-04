import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PromotionsService {
  baseUrl: string = environment.baseUrl;
  hasPromo: boolean = false;
  promoCodes: any[] = [];
  generalData: any;

  constructor(private _HttpClient: HttpClient) {}
  getPromotionsBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/promotions`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/promotions`, { params: params });
  }
  get(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/promotions`, {
      params: params,
    });
  }

  create(body: any): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}admin/promotions`, body);
  }

  delete(id: number) {
    return this._HttpClient.delete(`${this.baseUrl}admin/promotions/${id}`);
  }
  update(id: number, body: any): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}admin/promotions/${id}`, body);
  }

  RemoveBulk(ids: any): Observable<any> {
    return this._HttpClient.request(
      'delete',
      `${this.baseUrl}admin/promotions/bulk-delete`,
      { body: ids }
    );
  }

  paginate(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/promotions`, {
      params: params,
    });
  }

  toggleStatus(id: number, value: boolean): Observable<any> {
    return this._HttpClient.patch(
      `${this.baseUrl}admin/promotions/${id}/toggle`,
      {
        is_active: value,
      }
    );
  }

  getOnePromotion(idPromotion: number): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/promotions/${idPromotion}`
    );
  }
}
