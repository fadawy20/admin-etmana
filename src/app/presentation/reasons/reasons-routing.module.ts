import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { REASONSComponent } from './reasons.component';

const routes: Routes = [
  {
    path: '',
    component:REASONSComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class REASONSRoutingModule { }
