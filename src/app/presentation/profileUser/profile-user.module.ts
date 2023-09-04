import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileUserRoutingModule } from './profile-user-routing.module';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AddressComponent } from './address/address.component';
import { OrderComponent } from './order/order.component';
import { CreditComponent } from './credit/credit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderViewComponent } from './order-view/order-view.component';
import { AllTransactionComponent } from './all-transaction/all-transaction.component';

@NgModule({
  declarations: [
    ProfileUserComponent,
    AccountInfoComponent,
    AddressComponent,
    OrderComponent,
    CreditComponent,
    OrderViewComponent,
    // AlltransactionComponent,
    AllTransactionComponent,
  ],
  imports: [
    CommonModule,
    ProfileUserRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ProfileUserModule { }
