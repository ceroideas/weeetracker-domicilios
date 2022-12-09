import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoRenPage } from './step-two-ren.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoRenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoRenPageRoutingModule {}
