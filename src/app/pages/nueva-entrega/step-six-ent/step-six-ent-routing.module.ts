import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSixEntPage } from './step-six-ent.page';

const routes: Routes = [
  {
    path: '',
    component: StepSixEntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSixEntPageRoutingModule {}
