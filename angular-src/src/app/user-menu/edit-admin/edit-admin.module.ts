import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AppDesignModule} from "../../app-design/app-design.module";

import {EditStaticComponent} from "./edit-static/edit-static.component";

@NgModule({
  declarations: [
    EditStaticComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppDesignModule,
  ],
  exports: [
    EditStaticComponent,
  ],
  entryComponents: [
    EditStaticComponent,
  ]
})
export class EditAdminModule { }
