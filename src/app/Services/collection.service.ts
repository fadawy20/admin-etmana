import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  baseUrl: string = environment.baseUrl

  constructor(private _http: HttpClient) { }
  getCollection(params: any): Observable<any> {
    return this._http.get(`${this.baseUrl}admin/product/seller-variations/search`, { params: params });
  }

  // https://api-staging.etmana.com/api/admin/collections/:collection

  deleteCollection (collectionId : number) : Observable<any>{
    return this._http.delete(`${this.baseUrl}admin/collections/${collectionId}`)
  }

  // https://api-staging.etmana.com/api/admin/collections/toggle/:collection
  /**
   * {
    "toggle_attribute": "is_active",
    "toggle_value": false
}
   */
  changeStatusCollection(idCollection : number, statusCollection : any) : Observable<any>{
    return this._http.patch(`${this.baseUrl}admin/collections/toggle/${idCollection}`, {
      "toggle_attribute": "is_active",
      "toggle_value": statusCollection
    })
  }


  paginateProducts(Productparams: any): Observable<any> {
    return (
      this._http.get(`${this.baseUrl}admin/product/seller-variations/search`,
        { params: Productparams }
      )
    );
  }
  getBrands(params: any): Observable<any> {
    return this._http.get(`${this.baseUrl}admin/brands`, { params: params })
  }
  paginate(params: any): Observable<any> {
    return this._http.get(`${this.baseUrl}admin/collections`, { params: params });
  }

  createCollection(body: any) {
    return this._http.post(`${this.baseUrl}admin/collections`, body)
  }
}
