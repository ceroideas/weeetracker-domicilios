import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepTwoEntPage } from './step-two-ent.page';

const routes: Routes = [
  {
    path: '',
    component: StepTwoEntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoEntPageRoutingModule {}
