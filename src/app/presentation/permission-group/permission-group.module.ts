import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionGroupRoutingModule } from './permission-group-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PermissionGroupComponent } from './permission-group.component';
import { CreateGroupComponent } from './create-group/create-group.component';

@NgModule({
  declarations: [PermissionGroupComponent, CreateGroupComponent],
  imports: [
    CommonModule,
    PermissionGroupRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class PermissionGroupModule {}
