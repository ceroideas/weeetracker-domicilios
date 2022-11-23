import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFourReuPage } from './step-four-reu.page';

const routes: Routes = [
  {
    path: '',
    component: StepFourReuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFourReuPageRoutingModule {}
