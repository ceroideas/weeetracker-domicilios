import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoReuPage } from './step-two-reu.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoReuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoReuPageRoutingModule {}
