import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BannerComponent } from './banner.component';
import { CreatebannerComponent } from './components/createbanner/createbanner.component';

const routes: Routes = [
  {path : '', component : BannerComponent},
  {path : 'create', component : CreatebannerComponent},
  {path : 'edit/:id', component : CreatebannerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerRoutingModule { }
