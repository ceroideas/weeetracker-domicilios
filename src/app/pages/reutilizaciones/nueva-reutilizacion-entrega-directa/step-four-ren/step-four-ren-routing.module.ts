import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFourRenPage } from './step-four-ren.page';

const routes: Routes = [
  {
    path: '',
    component: StepFourRenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFourRenPageRoutingModule {}
