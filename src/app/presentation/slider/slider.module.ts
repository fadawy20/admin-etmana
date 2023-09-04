import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SliderRoutingModule } from './slider-routing.module';
import { SliderComponent } from './slider.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatesliderComponent } from './components/createslider/createslider.component';
import { Tree } from 'primeng/tree';
import { FormsliderComponent } from './components/formslider/formslider.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MessagesModule } from 'primeng/messages';
// import { MessageService } from 'primeng/api';



@NgModule({
  providers: [Tree],
  declarations: [
    SliderComponent,
    CreatesliderComponent,
    FormsliderComponent
  ],
  imports: [
    CommonModule,
    SliderRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],

})
export class SliderModule { }
