import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule, Routes} from "@angular/router";

import { AppComponent } from './app.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { HomeComponent } from './home/home.component';
import { PersonComponent } from './person/person.component';

import {PersonService} from "./person/person.service";

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'person', component: PersonComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    HomeComponent,
    PersonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  providers: [PersonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
