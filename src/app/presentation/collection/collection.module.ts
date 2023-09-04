import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CollectionRoutingModule } from './collection-routing.module';
import { CollectioncmsComponent } from './collectioncms.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatecollectionComponent } from './createcollection/createcollection.component';
import { PromotionsModule } from '../promotions/promotions.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CollectioncmsComponent,
    CreatecollectionComponent
  ],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    SharedModule,
    PromotionsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [MessageService, ConfirmationService]
})
export class CollectionModule { }
