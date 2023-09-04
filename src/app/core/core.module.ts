import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { HeaderDashboardComponent } from './header-dashboard/header-dashboard.component';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpErrorInterceptor } from './interceptors/error-interceptor.service';
import { HttpInterceptorService } from './interceptors/guest-interceptor.service';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DashboardComponent,
    HeaderDashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true }
  ],
})
export class CoreModule { }
