import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './banner.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatebannerComponent } from './components/createbanner/createbanner.component';
import { FormbannerComponent } from './components/formbanner/formbanner.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BannerComponent,
    CreatebannerComponent,
    FormbannerComponent
  ],
  imports: [
    CommonModule,
    BannerRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BannerModule { }
