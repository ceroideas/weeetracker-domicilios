import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOneRepPage } from './step-one-rep.page';

const routes: Routes = [
  {
    path: '',
    component: StepOneRepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneRepPageRoutingModule {}
