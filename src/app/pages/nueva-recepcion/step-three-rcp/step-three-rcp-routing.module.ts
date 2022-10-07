import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreeRcpPage } from './step-three-rcp.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreeRcpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeRcpPageRoutingModule {}
