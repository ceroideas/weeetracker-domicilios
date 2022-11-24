import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFiveRenPage } from './step-five-ren.page';

const routes: Routes = [
  {
    path: '',
    component: StepFiveRenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFiveRenPageRoutingModule {}
