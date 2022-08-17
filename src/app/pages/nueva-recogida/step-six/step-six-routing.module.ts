import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixPage } from './step-six.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixPageRoutingModule {}
