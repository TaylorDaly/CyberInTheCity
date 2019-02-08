import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {HttpErrorInterceptor} from "./http-error.interceptor";

import {AppRoutingModule, RoutingComponents} from "./app-routing.module";
import {AppDesignModule} from "./app-design/app-design.module";

import { AppComponent } from './app.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import {ImageCropperComponent} from "ngx-img-cropper";

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    RoutingComponents,
    ErrorComponent,
    FooterComponent,
    ImageCropperComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AppDesignModule,
    ReactiveFormsModule,
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
