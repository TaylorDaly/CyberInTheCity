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
import { EditContactComponent } from './edit-contact/edit-contact.component';
import {ImageCropperModule} from "ngx-img-cropper";
import {MatFormFieldModule} from "@angular/material";
import {MatInputModule} from "@angular/material";

const editList = [
  EditStaticComponent,
  EditAboutComponent,
  EditPeopleComponent,
  EditResearchComponent,
  EditEducationComponent,
  EditCareersComponent,
  EditEventsComponent,
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
    ImageCropperModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    editList,
  ],
  entryComponents: [
    editList
  ]
})
export class EditAdminModule { }
