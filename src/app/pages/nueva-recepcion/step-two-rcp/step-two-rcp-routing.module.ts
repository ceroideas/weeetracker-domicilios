import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoRcpPage } from './step-two-rcp.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoRcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoRcpPageRoutingModule {}
