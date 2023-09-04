import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { AuthService } from '../core/auth/services/auth-service.service';
@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  baseUrl: string = environment.baseUrl
  token: any

  constructor(private _HttpClient: HttpClient, private _authService: AuthService) {

    this.token = this._authService.getToken()

  }

  uploadImage(file: any): Observable<any> {
    let headers = new HttpHeaders({
      'Authorization': this.token
    });
    return this._HttpClient.post(`${this.baseUrl}admin/upload-media`, file, { 'headers':headers })
  }

}
