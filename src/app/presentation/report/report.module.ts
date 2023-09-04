import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ReportModule { }
