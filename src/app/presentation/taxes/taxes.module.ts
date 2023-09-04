import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaxesRoutingModule } from './taxes-routing.module';
import { TaxesComponent } from './taxes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TaxesComponent
  ],
  imports: [
    CommonModule,
    TaxesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TaxesModule { }
