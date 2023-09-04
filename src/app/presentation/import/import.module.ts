import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportRoutingModule } from './import-routing.module';
import { ImportComponent } from './import.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailsImportsComponent } from './details-imports/details-imports.component';


@NgModule({
  declarations: [
    ImportComponent,
    DetailsImportsComponent
  ],
  imports: [
    CommonModule,
    ImportRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ImportModule { }
