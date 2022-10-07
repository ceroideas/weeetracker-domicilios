import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOneAltRcpPage } from './step-one-alt-rcp.page';

const routes: Routes = [
  {
    path: '',
    component: StepOneAltRcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneAltRcpPageRoutingModule {}
