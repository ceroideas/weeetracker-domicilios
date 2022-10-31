import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFourEntPage } from './step-four-ent.page';

const routes: Routes = [
  {
    path: '',
    component: StepFourEntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFourEntPageRoutingModule {}
