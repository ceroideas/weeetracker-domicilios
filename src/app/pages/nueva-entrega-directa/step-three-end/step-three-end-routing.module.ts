import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreeEndPage } from './step-three-end.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreeEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeEndPageRoutingModule {}
