import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFourRrePage } from './step-four-rre.page';

const routes: Routes = [
  {
    path: '',
    component: StepFourRrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFourRrePageRoutingModule {}
