import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaEntregaDirectaPage } from './nueva-entrega-directa.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaEntregaDirectaPage
  },
  {
    path: 'step-one-end',
    loadChildren: () => import('./step-one-end/step-one-end.module').then( m => m.StepOneEndPageModule)
  },
  {
    path: 'step-two-end',
    loadChildren: () => import('./step-two-end/step-two-end.module').then( m => m.StepTwoEndPageModule)
  },
  {
    path: 'step-three-end',
    loadChildren: () => import('./step-three-end/step-three-end.module').then( m => m.StepThreeEndPageModule)
  },
  {
    path: 'step-four-end',
    loadChildren: () => import('./step-four-end/step-four-end.module').then( m => m.StepFourEndPageModule)
  },
  {
    path: 'step-five-end',
    loadChildren: () => import('./step-five-end/step-five-end.module').then( m => m.StepFiveEndPageModule)
  },
  {
    path: 'step-six-end',
    loadChildren: () => import('./step-six-end/step-six-end.module').then( m => m.StepSixEndPageModule)
  },
  {
    path: 'step-seven-end',
    loadChildren: () => import('./step-seven-end/step-seven-end.module').then( m => m.StepSevenEndPageModule)
  },  {
    path: 'step-eight-end',
    loadChildren: () => import('./step-eight-end/step-eight-end.module').then( m => m.StepEightEndPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaEntregaDirectaPageRoutingModule {}
