import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOneReuPage } from './step-one-reu.page';

const routes: Routes = [
  {
    path: '',
    component: StepOneReuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneReuPageRoutingModule {}
