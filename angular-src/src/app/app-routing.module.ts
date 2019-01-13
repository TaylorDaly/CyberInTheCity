import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {PersonComponent} from "./person/person.component";
import {EducationComponent} from "./education/education.component";
import {ResearchComponent} from "./research/research.component";
import {SignupComponent} from "./signup/signup.component";
import {GeneralComponent} from "./general/general.component";
import { EventsComponent } from './events/events.component';
import { NewsComponent } from './news/news.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import {SignupGuard} from "./Authentication/auth.guard";

const AppRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'person', component: PersonComponent},
  {path: 'education', component: EducationComponent},
  {path: 'research', component: ResearchComponent},
  {path: 'signup/:token', component: SignupComponent, canActivate: [SignupGuard]},
  {path: 'events', component: EventsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'general/:title', component: GeneralComponent},
  {path: 'register', component: RegisterComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
export const RoutingComponents =
  [
    HomeComponent,
    PersonComponent,
    EducationComponent,
    ResearchComponent,
    SignupComponent,
    EventsComponent,
    NewsComponent,
    LoginComponent,
    RegisterComponent,
    GeneralComponent
  ];

