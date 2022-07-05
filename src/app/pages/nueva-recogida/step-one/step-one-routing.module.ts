import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOnePage } from './step-one.page';

const routes: Routes = [
  {
    path: '',
    component: StepOnePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOnePageRoutingModule {}
