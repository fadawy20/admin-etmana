import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateShippingRuleComponent } from './create-shipping-rule/create-shipping-rule.component';
import { ShippingRulsComponent } from './shipping-ruls.component';

const routes: Routes = [
  { path: '', component: ShippingRulsComponent },
  {path: 'create-rule', component:CreateShippingRuleComponent},
  {path: 'edit-rule/:id', component:CreateShippingRuleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRulsRoutingModule { }
