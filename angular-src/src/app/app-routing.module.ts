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

const AppRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'person', component: PersonComponent},
  {path: 'education', component: EducationComponent},
  {path: 'research', component: ResearchComponent},
  {path: 'sign-up', component: SignupComponent},
  {path: 'events', component: EventsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'general/:title', component: GeneralComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes, {onSameUrlNavigation: "reload"})],
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
    GeneralComponent
  ];

