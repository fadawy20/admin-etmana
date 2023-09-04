import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BrandComponent
  ],
  imports: [
    CommonModule,
    BrandRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class BrandModule { }
