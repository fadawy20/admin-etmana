import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerRoutingModule } from './seller-routing.module';
import { SellerComponent } from './seller.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateSellerComponent } from './create-seller/create-seller.component';


@NgModule({
  declarations: [
    SellerComponent,
    CreateSellerComponent,
  ],
  imports: [
    CommonModule,
    SellerRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],

})
export class SellerModule { }
