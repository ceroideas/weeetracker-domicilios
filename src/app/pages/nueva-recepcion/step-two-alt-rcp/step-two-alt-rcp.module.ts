import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepTwoAltRcpPageRoutingModule } from './step-two-alt-rcp-routing.module';

import { StepTwoAltRcpPage } from './step-two-alt-rcp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepTwoAltRcpPageRoutingModule
  ],
  declarations: [StepTwoAltRcpPage]
})
export class StepTwoAltRcpPageModule {}
