import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductSetsComponent } from './product-sets.component';

const routes: Routes = [
  {
    path: '',
    component: ProductSetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductSetsRoutingModule { }
