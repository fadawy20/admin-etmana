import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SearchService {


  baseUrl: string = environment.baseUrl

  constructor(private http: HttpClient) { }




}
