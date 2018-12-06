import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {PersonComponent} from "./person/person.component";
import {EducationComponent} from "./education/education.component";
import {ResearchComponent} from "./research/research.component";
import {SignupComponent} from "./signup/signup.component";

const appRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'person', component: PersonComponent},
  {path: 'education', component: EducationComponent},
  {path: 'research', component: ResearchComponent},
  {path: 'signup', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
export const routingComponents =
  [
    HomeComponent,
    PersonComponent,
    EducationComponent,
    ResearchComponent,
    SignupComponent
  ];
