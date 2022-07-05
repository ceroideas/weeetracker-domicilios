import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoAltPage } from './step-two-alt.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoAltPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoAltPageRoutingModule {}
