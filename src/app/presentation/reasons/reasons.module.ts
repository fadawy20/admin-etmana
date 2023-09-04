import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { REASONSRoutingModule } from './reasons-routing.module';
import { REASONSComponent } from '../reasons/reasons.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    REASONSComponent
  ],
  imports: [
    CommonModule,
    REASONSRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class REASONSModule { }
