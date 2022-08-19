import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutComponent } from './containers';
import { NavComponent } from './containers/default-layout/nav/nav.component';
import { HeaderComponent } from './containers/default-layout/header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultLayoutComponent,
    NavComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
