import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SliderComponent } from './slider.component';
import { CreatesliderComponent } from './components/createslider/createslider.component';

const routes: Routes = [
  {path : '', component : SliderComponent},
  {path : 'Create', component : CreatesliderComponent},
  {path : 'edit/:id', component : CreatesliderComponent, pathMatch : "full"}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SliderRoutingModule { }
