import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _httpClient:HttpClient) { }
  post(apiEndpoint: string, request: any) :Observable<any> {
    return this._httpClient.post(apiEndpoint, request, { responseType: 'blob'});
  }
}
