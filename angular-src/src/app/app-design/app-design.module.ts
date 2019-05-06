import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {RouterModule} from "@angular/router";

import { CardInfoComponent } from './card-info/card-info.component';
import { CardBusinessComponent } from './card-business/card-business.component';
import { CardCareersComponent } from './card-careers/card-careers.component';
import { CardNewsComponent} from "./card-news/card-news.component";
import { ProfileComponent} from "./profile/profile.component";

import { EditorComponent } from './editor/editor.component';

import {CKEditorModule} from "ng2-ckeditor";
import { ListDataComponent } from './list-data/list-data.component';
import { ImageLinkComponent } from './image-link/image-link.component';

@NgModule({
  declarations: [
    CardInfoComponent,
    CardBusinessComponent,
    CardCareersComponent,
    EditorComponent,
    ListDataComponent,
    CardNewsComponent,
    ProfileComponent,
    ImageLinkComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    MatTableModule,
    RouterModule,
  ],
  exports: [
    CKEditorModule,
    CardInfoComponent,
    CardBusinessComponent,
    CardCareersComponent,
    CardNewsComponent,
    EditorComponent,
    ListDataComponent,
    MatTableModule,
    ProfileComponent,
    ImageLinkComponent,
  ],
  entryComponents: [
    ListDataComponent
  ]
})
export class AppDesignModule { }
