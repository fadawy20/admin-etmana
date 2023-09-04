import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttributesRoutingModule } from './attributes-routing.module';
import { AttributesComponent } from './attributes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AttributesComponent
  ],
  imports: [
    CommonModule,
    AttributesRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AttributesModule { }
