import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThemeModule } from './ui-modules/theme.modules';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { StatisticsCardComponent } from './components/statistics-card/statistics-card.component';
import { InfiniteScrollComponent } from './components/infinite-scroll/infinite-scroll.component';
import { CancelButtonComponent } from './components/cancel-button/cancel-button.component';
import { ScreenHaederComponent } from './components/screen-haeder/screen-haeder.component';
import { DeleteButtonComponent } from './components/delete-button/delete-button.component';
// import { ExportButtonComponent } from './components/export-button/export-button.component';
import { LoadingComponent } from './components/loading/loading.component';
import { DownloadComponent } from './components/download/download.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgSelectModule } from '@ng-select/ng-select';
import { CollectionComponent } from './components/collection/collection.component';
import { CustomDataTableComponents } from './components/collection/custom-data-table/custom-data-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsActiveDirective } from './directives/is-active.directive';
import { NumberPipe } from './pipes/convert/number.pipe';
import { IsImagePipe } from './pipes/images/is-image.pipe';
import { SallerconvertPipe } from './pipes/sallerconvert.pipe';
import { NewloadingComponent } from './newloading/newloading.component';
// import { NewloadingComponent } from './newloading/newloading.component';

@NgModule({
  declarations: [
    MenuListItemComponent,
    DataTableComponent,
    AddButtonComponent,
    StatisticsCardComponent,
    InfiniteScrollComponent,
    InfiniteScrollComponent,
    CancelButtonComponent,
    DeleteButtonComponent,
    ScreenHaederComponent,
    LoadingComponent,
    DownloadComponent,
    CollectionComponent,
    CustomDataTableComponents,
    IsActiveDirective,
    NumberPipe,
    IsImagePipe,
    SallerconvertPipe,
    NewloadingComponent,
    // NewloadingComponent,

  ],
  imports: [
    CommonModule,
    ThemeModule,
    NgxPaginationModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ThemeModule,
    MenuListItemComponent,
    DataTableComponent,
    AddButtonComponent,
    NgxPaginationModule,
    StatisticsCardComponent,
    InfiniteScrollComponent,
    CancelButtonComponent,
    DeleteButtonComponent,
    ScreenHaederComponent,
    LoadingComponent,
    DownloadComponent,
    MatSlideToggleModule,
    NgSelectModule,
    CollectionComponent,
    IsActiveDirective,
    NumberPipe,
    IsImagePipe,SallerconvertPipe,
    NewloadingComponent
    // NewloadingComponent
  ],
})
export class SharedModule {}
