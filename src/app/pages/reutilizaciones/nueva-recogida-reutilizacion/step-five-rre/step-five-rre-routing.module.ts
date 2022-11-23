import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFiveRrePage } from './step-five-rre.page';

const routes: Routes = [
  {
    path: '',
    component: StepFiveRrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFiveRrePageRoutingModule {}
