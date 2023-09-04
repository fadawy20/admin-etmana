import { NgModule } from '@angular/core';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectInfiniteScrollModule } from 'ng-mat-select-infinite-scroll';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';

const material = [
  MatSelectModule,
  MatSelectInfiniteScrollModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatRadioModule,
  MatRippleModule,
  MatToolbarModule,
  MatNativeDateModule,
  MatCardModule,
  MatDialogModule,
  MatSnackBarModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  MatSidenavModule,
  MatListModule,
  MatInputModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatDividerModule,
  MatCheckboxModule,
  MatTabsModule,
];

@NgModule({
  imports: [material],
  exports: [material],
})
export class MaterialImportsModule {}
