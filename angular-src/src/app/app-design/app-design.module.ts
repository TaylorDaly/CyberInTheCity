import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardInfoComponent } from './card-info/card-info.component';
import { CardBusinessComponent } from './card-business/card-business.component';
import { EditorComponent } from './editor/editor.component';

import {CKEditorModule} from "ng2-ckeditor";

@NgModule({
  declarations: [
    CardInfoComponent,
    CardBusinessComponent,
    EditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule,
  ],
  exports: [
    CKEditorModule,
    CardInfoComponent,
    CardBusinessComponent,
    EditorComponent,
  ]
})
export class AppDesignModule { }
