import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingRulsRoutingModule } from './shipping-ruls-routing.module';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ShippingRulsComponent } from './shipping-ruls.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateShippingRuleComponent } from './create-shipping-rule/create-shipping-rule.component';
import { Subscription } from 'rxjs';

@NgModule({
  declarations: [
    ShippingRulsComponent,
    CreateShippingRuleComponent
  ],
  imports: [
    CommonModule,
    ShippingRulsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  // providers: [Subscription]

})
export class ShippingRulsModule { }
