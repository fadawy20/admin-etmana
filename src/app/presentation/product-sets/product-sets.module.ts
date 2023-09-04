import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductSetsRoutingModule } from './product-sets-routing.module';
import { ProductSetsComponent } from './product-sets.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProductSetsComponent
  ],
  imports: [
    CommonModule,
    ProductSetsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ProductSetsModule { }
