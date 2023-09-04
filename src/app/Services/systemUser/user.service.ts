import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl: string = environment.baseUrl;

  constructor(private _HttpClient: HttpClient) {}
  getClientsBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/admins`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/admins`, { params: params });
  }
  systemUsers(params: any) {
    return this._HttpClient.get(`${this.baseUrl}admin/admins`, {
      params: params,
    });
  }

  deleteSystemUsers(id: any) {
    return this._HttpClient.delete(`${this.baseUrl}admin/admins/${id}`);
  }

  updateSystemUsers(user: any, id: any) {
    let obj: any = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      is_active: user.active,
      change_password: user.change_password,
      roles: [user.permissionGroup],
    };
    if (user.password) obj['password'] = user.password;

    return this._HttpClient.put(`${this.baseUrl}admin/admins/${id}`, obj);
  }

  craeteSystemUsers(user: any) {
    let obj: any = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      is_active: user.active,
      change_password: user.change_password,
      roles: [user.permissionGroup.id],
    };
    return this._HttpClient.post(`${this.baseUrl}admin/admins`, obj);
  }
}
