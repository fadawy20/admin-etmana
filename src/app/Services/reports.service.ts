import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  downloadReport(reportType: string, dateFrom: any, dateTo: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/${reportType}/report?date_from=${dateFrom}&date_to=${dateTo}`, { responseType: 'blob' })
  }
  downloadReportSummary(reportType: string, dateFrom: any, dateTo: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/orders/${reportType}?date_from=${dateFrom}&date_to=${dateTo}`, { responseType: 'blob' })
  }
  // {{domain}}/admin/variations/restock-report?date_from=2023-08-01&date_to=2023-08-21
  // Inventory Restock Analysis
  downloadInventoryRestock(dateFrom: any, dateTo: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/variations/restock-report?date_from=${dateFrom}&date_to=${dateTo}`, { responseType: 'blob' })
  }
  //{{domain}}/admin/clients/loyalty-report?date_from=2023-08-01&date_to=2023-08-21
  downloadCustomerLoyalty(dateFrom: any, dateTo: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/clients/loyalty-report?date_from=${dateFrom}&date_to=${dateTo}`, { responseType: 'blob' })
  }

  // {{domain}}/admin/products/success-rate-report?date_from=2023-08-01&date_to=2023-08-21
  downloadSuccessRate(dateFrom: any, dateTo: any): Observable<any> {
    return this.http.get(`${this.baseUrl}admin/products/success-rate-report?date_from=${dateFrom}&date_to=${dateTo}`, { responseType: 'blob' })
  }

}
