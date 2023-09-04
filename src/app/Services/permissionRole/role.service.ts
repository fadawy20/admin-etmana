import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  baseUrl: string = environment.baseUrl;

  constructor(private _HttpClient: HttpClient) {}
  getRolsBySearch(params: any): Observable<any> {
    return this._HttpClient.get(
      `${this.baseUrl}admin/roles`,
      { params: params }
    );
  }
  getFilterColumn(params: any): Observable<any> {
    return this._HttpClient.get(`${this.baseUrl}admin/roles`, { params: params });
  }
  getRoles() {
    return this._HttpClient.get(`${this.baseUrl}admin/roles`);
  }

  getPeermissionRole() {
    return this._HttpClient.get(`${this.baseUrl}admin/permissions`);
  }

  createRole(role: any) {
    return this._HttpClient.post(`${this.baseUrl}admin/roles`, role);
  }

  updateRole(role: any, idRole: number) {
    return this._HttpClient.put(`${this.baseUrl}admin/roles/${idRole}`, role);
  }

  deleteRole(roleId: any) {
    return this._HttpClient.delete(`${this.baseUrl}admin/roles/${roleId}`);
  }

  showOneRole(roleId: any) {
    return this._HttpClient.get(`${this.baseUrl}admin/roles/${roleId}`);
  }

  showPermisssion() {
    let myMap = new Map<number, string>();
    myMap.set(1, 'read');
    myMap.set(2, 'show');
    myMap.set(3, 'create');
    myMap.set(4, 'edit');
    myMap.set(5, 'delete');
    myMap.set(6, 'toggle');
    myMap.set(7, 'export');
    myMap.set(8, 'approve products');
    myMap.set(9, 'reject products');
    myMap.set(10, 'publish products');
    myMap.set(11, 'set orders status');
    myMap.set(12, 'config top selling');
    myMap.set(13, 'config tax');
    myMap.set(14, 'get orders status');
    myMap.set(15, 'get inventory levels');
    myMap.set(16, 'get high performing categories');
    myMap.set(17, 'get high performing sellers');
    myMap.set(18, 'get sales funnel');
    myMap.set(19, 'get platform');
    myMap.set(20, 'get promotions');
    return myMap;
  }
}
