import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoRepPage } from './step-two-rep.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoRepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoRepPageRoutingModule {}
