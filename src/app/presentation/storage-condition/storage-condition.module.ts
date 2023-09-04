import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageConditionRoutingModule } from './storage-condition-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageConditionComponent } from './storage-condition.component';

@NgModule({
  declarations: [StorageConditionComponent],
  imports: [
    CommonModule,
    StorageConditionRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class StorageConditionModule {}
