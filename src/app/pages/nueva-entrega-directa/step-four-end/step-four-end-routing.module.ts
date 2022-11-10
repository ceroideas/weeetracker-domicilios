import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepFourEndPage } from './step-four-end.page';

const routes: Routes = [
  {
    path: '',
    component: StepFourEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepFourEndPageRoutingModule {}
