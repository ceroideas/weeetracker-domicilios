import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoAltRcpPage } from './step-two-alt-rcp.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoAltRcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoAltRcpPageRoutingModule {}
