import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreeRepPage } from './step-three-rep.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreeRepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeRepPageRoutingModule {}
