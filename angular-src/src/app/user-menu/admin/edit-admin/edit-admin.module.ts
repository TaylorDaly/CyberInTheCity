import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppDesignModule} from "../../../app-design/app-design.module";

import {EditStaticComponent} from "./edit-static/edit-static.component";
import { EditAboutComponent } from './edit-about/edit-about.component';
import { EditPeopleComponent } from './edit-people/edit-people.component';
import { EditResearchComponent } from './edit-research/edit-research.component';
import { EditEducationComponent } from './edit-education/edit-education.component';
import { EditCareersComponent } from './edit-careers/edit-careers.component';
import { EditEventsComponent } from './edit-events/edit-events.component';
import { EditNewsComponent } from './edit-news/edit-news.component';
import { EditContactComponent } from './edit-contact/edit-contact.component';

const editList = [
  EditStaticComponent,
  EditAboutComponent,
  EditPeopleComponent,
  EditResearchComponent,
  EditEducationComponent,
  EditCareersComponent,
  EditEventsComponent,
  EditNewsComponent,
  EditContactComponent,
];

@NgModule({
  declarations: [
    editList,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppDesignModule,
  ],
  exports: [
    editList
  ],
  entryComponents: [
    editList
  ]
})
export class EditAdminModule { }
