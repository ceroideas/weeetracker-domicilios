import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaReutilizacionEntregaDirectaPage } from './nueva-reutilizacion-entrega-directa.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaReutilizacionEntregaDirectaPage
  },
  {
    path: 'step-one-ren',
    loadChildren: () => import('./step-one-ren/step-one-ren.module').then( m => m.StepOneRenPageModule)
  },
  {
    path: 'step-two-ren',
    loadChildren: () => import('./step-two-ren/step-two-ren.module').then( m => m.StepTwoRenPageModule)
  },
  {
    path: 'step-three-ren',
    loadChildren: () => import('./step-three-ren/step-three-ren.module').then( m => m.StepThreeRenPageModule)
  },
  {
    path: 'step-four-ren',
    loadChildren: () => import('./step-four-ren/step-four-ren.module').then( m => m.StepFourRenPageModule)
  },
  {
    path: 'step-five-ren',
    loadChildren: () => import('./step-five-ren/step-five-ren.module').then( m => m.StepFiveRenPageModule)
  },
  {
    path: 'step-six-ren',
    loadChildren: () => import('./step-six-ren/step-six-ren.module').then( m => m.StepSixRenPageModule)
  },
  {
    path: 'step-seven-ren',
    loadChildren: () => import('./step-seven-ren/step-seven-ren.module').then( m => m.StepSevenRenPageModule)
  },
  {
    path: 'step-eight-ren',
    loadChildren: () => import('./step-eight-ren/step-eight-ren.module').then( m => m.StepEightRenPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaReutilizacionEntregaDirectaPageRoutingModule {}
