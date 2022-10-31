import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreeEntPage } from './step-three-ent.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreeEntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeEntPageRoutingModule {}
