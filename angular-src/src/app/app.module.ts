import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import {AppRoutingModule, RoutingComponents} from "./app-routing.module";

import { AppComponent } from './app.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import {HttpErrorInterceptor} from "./http-error.interceptor";
import {SignupGuard} from "./Authentication/auth.guard";
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    RoutingComponents,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  SignupGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
