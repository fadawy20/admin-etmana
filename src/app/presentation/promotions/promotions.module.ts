import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionsComponent } from './promotions.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatePromotionsComponent } from './components/create-promotions/create-promotions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralFormComponent } from './components/general-form/general-form.component';
import { ItemsComponent } from './components/items/items.component';
import { Tree, TreeModule } from 'primeng/tree';


@NgModule({
  providers: [Tree],
  declarations: [
    PromotionsComponent,
    CreatePromotionsComponent,
    GeneralFormComponent,
    ItemsComponent,

  ],
  imports: [
    CommonModule,
    PromotionsRoutingModule,
    SharedModule,
    ReactiveFormsModule,

  ], exports :[
    ItemsComponent
  ]
})
export class PromotionsModule { }
