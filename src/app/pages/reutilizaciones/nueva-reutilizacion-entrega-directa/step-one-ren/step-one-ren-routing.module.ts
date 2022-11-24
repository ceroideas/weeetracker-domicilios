import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOneRenPage } from './step-one-ren.page';

const routes: Routes = [
  {
    path: '',
    component: StepOneRenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneRenPageRoutingModule {}
