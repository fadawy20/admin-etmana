import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsImportsComponent } from './details-imports/details-imports.component';
import { ImportComponent } from './import.component';

const routes: Routes = [
  {
    path: '',
    component:ImportComponent
  },
  {
    path: 'import-details/:id',
    component:DetailsImportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
