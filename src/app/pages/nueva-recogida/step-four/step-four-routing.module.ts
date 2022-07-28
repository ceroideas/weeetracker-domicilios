import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFourPage } from './step-four.page';

const routes: Routes = [
  {
    path: '',
    component: StepFourPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFourPageRoutingModule {}
