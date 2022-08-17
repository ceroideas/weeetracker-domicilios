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
  },
  {
    path: 'summary',
    loadChildren: () => import('./summary/summary.module').then( m => m.SummaryPageModule)
  },
  {
    path: 'edit-read',
    loadChildren: () => import('./edit-read/edit-read.module').then( m => m.EditReadPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreePageRoutingModule {}
