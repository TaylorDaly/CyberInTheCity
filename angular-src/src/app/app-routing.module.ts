import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {PersonComponent} from "./person/person.component";

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'person', component: PersonComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
export const routingComponents =
  [
    HomeComponent,
    PersonComponent
  ];
