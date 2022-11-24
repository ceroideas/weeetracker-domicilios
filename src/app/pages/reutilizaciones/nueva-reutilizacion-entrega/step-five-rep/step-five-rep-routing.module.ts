import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFiveRepPage } from './step-five-rep.page';

const routes: Routes = [
  {
    path: '',
    component: StepFiveRepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFiveRepPageRoutingModule {}
