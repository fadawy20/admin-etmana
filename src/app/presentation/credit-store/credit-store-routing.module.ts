import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateCreditComponent } from './create-credit/create-credit.component';
import { CreditStoreComponent } from './credit-store.component';

const routes: Routes = [
  { path: '', component: CreditStoreComponent },
  {path: 'create-credit', component:CreateCreditComponent},
  {path: 'edit-credit/:id', component:CreateCreditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditStoreRoutingModule { }
