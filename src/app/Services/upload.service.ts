import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../core/auth/services/auth-service.service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  baseUrl: string = environment.baseUrl;
  token: any;

  constructor(private _http: HttpClient, private _authService: AuthService) {
    this.token = this._authService.getToken();
  }

  upload(id: number, body: any): Observable<any> {
    return this._http.post(
      `${this.baseUrl}admin/products/import-new/${id}`,
      body
    );
  }

  uploadFile(file: any, id: number): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this._http.post(
      `${this.baseUrl}admin/products/import_logs/${id}`,
      file,
      {
        headers: headers,
        reportProgress: true,
        observe: 'events',
      }
    );
  }
  uploadFileone(file: any): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this._http.post(
      `${this.baseUrl}admin/products/import-update`,
      file,
      {
        headers: headers,
      }
    );
  }
  downloadFileone(): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.token,
    });

    return this._http.get(
      `${this.baseUrl}admin/products/import-update`,

      { responseType: 'blob' }
    );
  }
}
