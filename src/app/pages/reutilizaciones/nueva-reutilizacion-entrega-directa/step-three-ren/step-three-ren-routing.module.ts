import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreeRenPage } from './step-three-ren.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreeRenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeRenPageRoutingModule {}
