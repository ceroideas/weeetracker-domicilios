import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepSevenEndPageRoutingModule } from './step-seven-end-routing.module';

import { StepSevenEndPage } from './step-seven-end.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepSevenEndPageRoutingModule
  ],
  declarations: [StepSevenEndPage]
})
export class StepSevenEndPageModule {}
