import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixRepPage } from './step-six-rep.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixRepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixRepPageRoutingModule {}
