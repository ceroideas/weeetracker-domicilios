import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreeReuPage } from './step-three-reu.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreeReuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeReuPageRoutingModule {}
