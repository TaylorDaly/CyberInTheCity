import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {AppRoutingModule, routingComponents} from "./app-routing.module";

import { AppComponent } from './app.component';
import { NavmenuComponent } from './navmenu/navmenu.component';

import {PersonService} from "./person/person.service";

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    routingComponents,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [PersonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
