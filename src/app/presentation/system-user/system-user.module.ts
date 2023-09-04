import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemUserRoutingModule } from './system-user-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SystemUserComponent } from './system-user.component';
@NgModule({
  declarations: [SystemUserComponent],
  imports: [
    CommonModule,
    SystemUserRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SystemUserModule {}
