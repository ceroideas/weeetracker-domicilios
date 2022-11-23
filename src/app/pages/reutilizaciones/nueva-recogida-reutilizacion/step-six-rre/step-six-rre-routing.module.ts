import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixRrePage } from './step-six-rre.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixRrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixRrePageRoutingModule {}
