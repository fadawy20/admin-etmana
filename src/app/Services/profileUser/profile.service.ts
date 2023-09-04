import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  SERVER_URL: string = environment.baseUrl;
  constructor(private _http: HttpClient) { }
  getCLientProfile(idUser: number): Observable<any> {
    return this._http.get(`${this.SERVER_URL}admin/clients/${idUser}`);
  }

  changePassword(object: any): Observable<any> {
    return this._http.patch(
      `${this.SERVER_URL}client/profile/password`,
      object
    );
  }
  saveUpdatedProfile(data: any, idUser: number): Observable<any> {
    return this._http.put(`${this.SERVER_URL}admin/clients/${idUser}`, data);
  }



  observable = new BehaviorSubject(0);
}
