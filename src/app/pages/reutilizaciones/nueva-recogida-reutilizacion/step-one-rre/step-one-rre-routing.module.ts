import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOneRrePage } from './step-one-rre.page';

const routes: Routes = [
  {
    path: '',
    component: StepOneRrePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneRrePageRoutingModule {}
