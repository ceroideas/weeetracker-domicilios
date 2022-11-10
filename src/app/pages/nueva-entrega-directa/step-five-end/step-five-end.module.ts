import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepFiveEndPageRoutingModule } from './step-five-end-routing.module';

import { StepFiveEndPage } from './step-five-end.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepFiveEndPageRoutingModule
  ],
  declarations: [StepFiveEndPage]
})
export class StepFiveEndPageModule {}
