import { CreateGroupComponent } from './create-group/create-group.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionGroupComponent } from './permission-group.component';

const routes: Routes = [
  {
    path: '',
    component: PermissionGroupComponent,
  },
  {
    path: 'create-Group',
    component: CreateGroupComponent,
  },
  {
    path: 'create-Group/:id',
    component: CreateGroupComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionGroupRoutingModule {}
