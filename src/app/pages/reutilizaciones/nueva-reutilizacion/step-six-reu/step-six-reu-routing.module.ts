import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixReuPage } from './step-six-reu.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixReuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixReuPageRoutingModule {}
