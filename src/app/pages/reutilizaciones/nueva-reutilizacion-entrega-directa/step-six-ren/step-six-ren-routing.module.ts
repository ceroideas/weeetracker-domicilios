import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixRenPage } from './step-six-ren.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixRenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixRenPageRoutingModule {}
