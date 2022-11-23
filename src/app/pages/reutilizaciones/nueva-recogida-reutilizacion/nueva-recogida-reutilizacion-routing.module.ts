import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaRecogidaReutilizacionPage } from './nueva-recogida-reutilizacion.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaRecogidaReutilizacionPage
  },
  {
    path: 'step-one-rre',
    loadChildren: () => import('./step-one-rre/step-one-rre.module').then( m => m.StepOneRrePageModule)
  },
  {
    path: 'step-two-rre',
    loadChildren: () => import('./step-two-rre/step-two-rre.module').then( m => m.StepTwoRrePageModule)
  },
  {
    path: 'step-three-rre',
    loadChildren: () => import('./step-three-rre/step-three-rre.module').then( m => m.StepThreeRrePageModule)
  },
  {
    path: 'step-four-rre',
    loadChildren: () => import('./step-four-rre/step-four-rre.module').then( m => m.StepFourRrePageModule)
  },
  {
    path: 'step-five-rre',
    loadChildren: () => import('./step-five-rre/step-five-rre.module').then( m => m.StepFiveRrePageModule)
  },
  {
    path: 'step-six-rre',
    loadChildren: () => import('./step-six-rre/step-six-rre.module').then( m => m.StepSixRrePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaRecogidaReutilizacionPageRoutingModule {}
