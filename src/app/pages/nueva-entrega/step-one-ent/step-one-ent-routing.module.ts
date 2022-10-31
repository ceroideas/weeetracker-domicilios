import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepOneEntPage } from './step-one-ent.page';

const routes: Routes = [
  {
    path: '',
    component: StepOneEntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneEntPageRoutingModule {}
