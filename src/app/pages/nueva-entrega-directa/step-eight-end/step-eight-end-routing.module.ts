import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepEightEndPage } from './step-eight-end.page';

const routes: Routes = [
  {
    path: '',
    component: StepEightEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepEightEndPageRoutingModule {}
