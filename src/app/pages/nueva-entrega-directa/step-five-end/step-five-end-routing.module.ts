import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFiveEndPage } from './step-five-end.page';

const routes: Routes = [
  {
    path: '',
    component: StepFiveEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFiveEndPageRoutingModule {}
