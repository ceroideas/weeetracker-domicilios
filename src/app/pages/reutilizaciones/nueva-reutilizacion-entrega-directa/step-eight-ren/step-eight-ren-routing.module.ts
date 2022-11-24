import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepEightRenPage } from './step-eight-ren.page';

const routes: Routes = [
  {
    path: '',
    component: StepEightRenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepEightRenPageRoutingModule {}
