import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from "@angular/router";

import { AppComponent } from './app.component';
import { NavmenuComponent } from './navmenu/navmenu.component';
import { PeopleComponent } from './people/people.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'people', component: PeopleComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    NavmenuComponent,
    PeopleComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    // HttpModule,
    RouterModule.forRoot(
      appRoutes,
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
