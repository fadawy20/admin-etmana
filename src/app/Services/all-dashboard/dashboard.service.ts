import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl: string = environment.baseUrl;
  constructor(private _HttpClient: HttpClient) {}

  allDashboard(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/dashboard/all`, {
      params: params,
    });
  }
}
