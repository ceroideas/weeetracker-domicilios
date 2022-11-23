import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoRrePage } from './step-two-rre.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoRrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoRrePageRoutingModule {}
