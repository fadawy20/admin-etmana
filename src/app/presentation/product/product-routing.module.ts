import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateConfigComponent } from './configurable-product/create-config/create-config.component';
import { EditConfigComponent } from './configurable-product/edit-config/edit-config.component';
import { ProductComponent } from './product.component';
import { CreateComponent } from './simple-product/create/create.component';
import { EditComponent } from './simple-product/edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
  },
  {
    path: 'create-simple-product',
    component: CreateComponent
  },
  {
    path: 'edit-simple-product/:id',
    component: EditComponent,
  },
  {
    path: 'create-configurable-product',
    component: CreateConfigComponent
  },
  {
    path: 'edit-configurable-product/:id',
    component: EditConfigComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
