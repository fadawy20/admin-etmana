import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ProductComponent } from './product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateComponent } from './simple-product/create/create.component';
import { EditComponent } from './simple-product/edit/edit.component';
import { ProductInfoTabComponent } from './simple-product/product-info-tab/product-info-tab.component';
import { SimpleProductFormService } from './Services/simple-product-form.service';
import { FulfilmentTapComponent } from './simple-product/fulfilment-tap/fulfilment-tap.component';
import { MarketingTapComponent } from './simple-product/marketing-tap/marketing-tap.component';
import { CreateConfigComponent } from './configurable-product/create-config/create-config.component';
import { EditConfigComponent } from './configurable-product/edit-config/edit-config.component';
import { ConfigMarketingTapComponent } from './configurable-product/config-marketing-tap/config-marketing-tap.component';
import { ConfigFulfilmentTapComponent } from './configurable-product/config-fulfilment-tap/config-fulfilment-tap.component';
import { ConfigInfoTapComponent } from './configurable-product/config-info-tap/config-info-tap.component';




@NgModule({
  declarations: [
    ProductComponent,
    CreateComponent,
    EditComponent,
    ProductInfoTabComponent,
    FulfilmentTapComponent,
    MarketingTapComponent,
    CreateConfigComponent,
    EditConfigComponent,
    ConfigMarketingTapComponent,
    ConfigFulfilmentTapComponent,
    ConfigInfoTapComponent,
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers:[SimpleProductFormService]

})
export class ProductModule { }
