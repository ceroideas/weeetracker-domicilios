import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixEndPage } from './step-six-end.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixEndPageRoutingModule {}
