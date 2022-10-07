import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixRcpPage } from './step-six-rcp.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixRcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixRcpPageRoutingModule {}
