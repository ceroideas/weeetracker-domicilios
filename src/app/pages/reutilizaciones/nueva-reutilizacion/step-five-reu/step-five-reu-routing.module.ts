import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFiveReuPage } from './step-five-reu.page';

const routes: Routes = [
  {
    path: '',
    component: StepFiveReuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFiveReuPageRoutingModule {}
