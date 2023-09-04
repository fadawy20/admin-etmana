import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { AccountInfoComponent } from './account-info/account-info.component';
import { AddressComponent } from './address/address.component';
import { CreditComponent } from './credit/credit.component';
import { OrderComponent } from './order/order.component';
import { OrderViewComponent } from './order-view/order-view.component';
import { AllTransactionComponent } from './all-transaction/all-transaction.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileUserComponent,
    children: [
      { path: '', redirectTo: 'acount-info', pathMatch: 'full' },
      {
        path: 'acount-info/:id',
        component: AccountInfoComponent,
      },
      {
        path: 'address/:id',
        component: AddressComponent,
      },
      {
        path: 'orders/:id',
        component: OrderComponent,
      },
      // {
      //   path: 'orders/:id',
      //   component: OrderViewComponent,
      // },
      {
        path: 'credit/:id',
        component: CreditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileUserRoutingModule { }
