import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorsRoutingModule } from './colors-routing.module';
import { ColorsComponent } from './colors.component';


@NgModule({
  declarations: [
    ColorsComponent
  ],
  imports: [
    CommonModule,
    ColorsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ColorsModule { }
