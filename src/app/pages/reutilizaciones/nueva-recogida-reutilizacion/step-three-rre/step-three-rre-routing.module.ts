import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreeRrePage } from './step-three-rre.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreeRrePage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeRrePageRoutingModule {}
