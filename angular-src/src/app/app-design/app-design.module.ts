import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardInfoComponent } from './card-info/card-info.component';
import { CardBusinessComponent } from './card-business/card-business.component';

@NgModule({
  declarations: [
    CardInfoComponent,
    CardBusinessComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardInfoComponent,
    CardBusinessComponent,
  ]
})
export class AppDesignModule { }
