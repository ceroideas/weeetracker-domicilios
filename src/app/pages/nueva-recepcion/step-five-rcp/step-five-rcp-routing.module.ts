import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFiveRcpPage } from './step-five-rcp.page';

const routes: Routes = [
  {
    path: '',
    component: StepFiveRcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFiveRcpPageRoutingModule {}
