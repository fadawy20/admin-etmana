import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewOrderComponent } from './view-order/view-order.component';
import { OrderShowComponent } from './view-order/pages/order-show/order-show.component';
import { OrderSummaryComponent } from './view-order/pages/order-summary/order-summary.component';
import { StoreCreditComponent } from './view-order/pages/store-credit/store-credit.component';
import { CommentComponent } from './view-order/pages/comment/comment.component';
// import { MatExpansionModule } from '@angular/material/expansion';



@NgModule({
  declarations: [
    OrderComponent,
    CreateOrderComponent,
    ViewOrderComponent,
    OrderShowComponent,
    OrderSummaryComponent,
    StoreCreditComponent,
    CommentComponent,
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    // MatExpansionModule

  ]
})
export class OrderModule { }
