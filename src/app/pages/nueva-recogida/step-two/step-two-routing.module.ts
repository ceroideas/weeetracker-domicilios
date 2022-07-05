import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoPage } from './step-two.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoPageRoutingModule {}
