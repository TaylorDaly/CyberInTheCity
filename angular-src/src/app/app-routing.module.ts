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
import { AboutUsComponent } from './about-us/about-us.component';
import { CareersComponent } from './careers/careers.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ProfileComponent } from './profile/profile.component';
import { CourseComponent } from './course/course.component';
import { ResearchInfoComponent } from './research-info/research-info.component';

import {SignupGuard} from "./Authentication/auth.guard";

const AppRoutes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutUsComponent},
  {path: 'person', component: PersonComponent},
  {path: 'education', component: EducationComponent},
  {path: 'research', component: ResearchComponent},
  {path: 'signup/:token', component: SignupComponent, canActivate: [SignupGuard]},
  {path: 'events', component: EventsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'careers', component: CareersComponent},
  {path: 'contact', component: ContactUsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'general/:title', component: GeneralComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user-menu', component: UserMenuComponent},
  {path: 'profile/:name', component: ProfileComponent},
  {path: 'course/:courseInfo', component: CourseComponent},
  {path: 'research/:title', component: ResearchInfoComponent},
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
    GeneralComponent,
    AboutUsComponent,
    CareersComponent,
    ContactUsComponent,
    UserMenuComponent,
    ProfileComponent,
    CourseComponent,
    ResearchInfoComponent,
  ];

