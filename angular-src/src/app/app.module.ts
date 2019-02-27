import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatButtonModule, MatTooltipModule} from '@angular/material'
import {HttpErrorInterceptor} from "./error/http-error.interceptor";

import {AppRoutingModule, RoutingComponents} from "./app-routing.module";
import {AppDesignModule} from "./app-design/app-design.module";

import {AppComponent} from './app.component';
import {NavmenuComponent} from './navmenu/navmenu.component';
import {ErrorComponent} from './error/error.component';
import {FooterComponent} from './footer/footer.component';
import {ImageCropperComponent} from "ngx-img-cropper";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AuthInterceptor} from "./Authentication/auth.interceptor";
import {EditAdminModule} from "./user-menu/admin/edit-admin/edit-admin.module";
import {AdminComponent} from './user-menu/admin/admin.component';
import {InfiniteScrollModule} from "ngx-infinite-scroll";

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    RoutingComponents,
    ErrorComponent,
    FooterComponent,
    ImageCropperComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AppDesignModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    EditAdminModule,
    InfiniteScrollModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
