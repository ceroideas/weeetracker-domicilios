import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StepThreePage } from './step-three.page';

const routes: Routes = [
  {
    path: '',
    component: StepThreePage
  },
  {
    path: 'readed',
    loadChildren: () => import('./readed/readed.module').then( m => m.ReadedPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreePageRoutingModule {}
