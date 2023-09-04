import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
