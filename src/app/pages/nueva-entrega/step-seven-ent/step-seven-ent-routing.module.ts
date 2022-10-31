import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepSevenEntPage } from './step-seven-ent.page';

const routes: Routes = [
  {
    path: '',
    component: StepSevenEntPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepSevenEntPageRoutingModule {}
