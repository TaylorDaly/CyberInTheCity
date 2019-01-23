import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpErrorInterceptor} from "./http-error.interceptor";

import {AppRoutingModule, RoutingComponents} from "./app-routing.module";
import {AppDesignModule} from "./app-design/app-design.module";

import { AppComponent } from './app.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    RoutingComponents,
    ErrorComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AppDesignModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
