import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSevenEndPage } from './step-seven-end.page';

const routes: Routes = [
  {
    path: '',
    component: StepSevenEndPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSevenEndPageRoutingModule {}
