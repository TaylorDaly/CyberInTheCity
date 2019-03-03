import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';

import { CardInfoComponent } from './card-info/card-info.component';
import { CardBusinessComponent } from './card-business/card-business.component';
import { CardCareersComponent } from './card-careers/card-careers.component';
import { CardNewsComponent} from "./card-news/card-news.component";
import { EditorComponent } from './editor/editor.component';

import {CKEditorModule} from "ng2-ckeditor";
import { ListDataComponent } from './list-data/list-data.component';

@NgModule({
  declarations: [
    CardInfoComponent,
    CardBusinessComponent,
    CardCareersComponent,
    EditorComponent,
    ListDataComponent,
    CardNewsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
    MatTableModule,
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
  ],
  entryComponents: [
    ListDataComponent
  ]
})
export class AppDesignModule { }
