import { ViewOrderComponent } from './view-order/view-order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { LoadingGuard } from './loading.guard';
import { OrderComponent } from './order.component';

const routes: Routes = [
  { path: '', component: OrderComponent },
  { path: 'create-order', component: CreateOrderComponent },
  { path: 'view-order/:id', component: ViewOrderComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
