import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSellerComponent } from './create-seller/create-seller.component';
import { SellerComponent } from './seller.component';

const routes: Routes = [
  {path: '', component:SellerComponent},
  {path: 'create-seller', component:CreateSellerComponent},
  {path: 'edit-seller/:id', component:CreateSellerComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerRoutingModule { }
