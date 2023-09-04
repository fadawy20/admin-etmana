import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    ToastrModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
