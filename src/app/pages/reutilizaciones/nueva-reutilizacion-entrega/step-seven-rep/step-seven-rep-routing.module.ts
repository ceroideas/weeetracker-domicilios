import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSevenRepPage } from './step-seven-rep.page';

const routes: Routes = [
  {
    path: '',
    component: StepSevenRepPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSevenRepPageRoutingModule {}
