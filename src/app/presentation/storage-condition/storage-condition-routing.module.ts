import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageConditionComponent } from './storage-condition.component';

const routes: Routes = [
  {
    path: '',
    component: StorageConditionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageConditionRoutingModule { }
