import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrentLocationService {
  constructor(private _http: HttpClient) {}
  getLocation() {
    return this._http.get(`https://ipapi.co/json`);
  }
}
