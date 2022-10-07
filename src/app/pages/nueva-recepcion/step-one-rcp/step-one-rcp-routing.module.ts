import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOneRcpPage } from './step-one-rcp.page';

const routes: Routes = [
  {
    path: '',
    component: StepOneRcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneRcpPageRoutingModule {}
