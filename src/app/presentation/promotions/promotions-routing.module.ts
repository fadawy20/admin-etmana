import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePromotionsComponent } from './components/create-promotions/create-promotions.component';
import { PromotionsComponent } from './promotions.component';

const routes: Routes = [
  {
    path: '',
    component: PromotionsComponent,
  },
  {
    path: 'Create',
    component: CreatePromotionsComponent,
  },
  {
    path: 'edit/:id',
    component: CreatePromotionsComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionsRoutingModule {}
