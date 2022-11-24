import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFourRepPage } from './step-four-rep.page';

const routes: Routes = [
  {
    path: '',
    component: StepFourRepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFourRepPageRoutingModule {}
