import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditStoreRoutingModule } from './credit-store-routing.module';
import { CreateCreditComponent } from './create-credit/create-credit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreditStoreComponent } from './credit-store.component';


@NgModule({
  declarations: [
    CreditStoreComponent,
    CreateCreditComponent
  ],
  imports: [
    CommonModule,
    CreditStoreRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class CreditStoreModule { }
