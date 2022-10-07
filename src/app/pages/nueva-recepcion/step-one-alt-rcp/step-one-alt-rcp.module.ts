import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StepOneAltRcpPageRoutingModule } from './step-one-alt-rcp-routing.module';

import { StepOneAltRcpPage } from './step-one-alt-rcp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StepOneAltRcpPageRoutingModule
  ],
  declarations: [StepOneAltRcpPage]
})
export class StepOneAltRcpPageModule {}
