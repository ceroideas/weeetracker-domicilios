import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFiveEntPage } from './step-five-ent.page';

const routes: Routes = [
  {
    path: '',
    component: StepFiveEntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFiveEntPageRoutingModule {}
