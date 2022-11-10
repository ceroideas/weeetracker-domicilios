import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepSixEndPageRoutingModule } from './step-six-end-routing.module';

import { StepSixEndPage } from './step-six-end.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepSixEndPageRoutingModule
  ],
  declarations: [StepSixEndPage]
})
export class StepSixEndPageModule {}
