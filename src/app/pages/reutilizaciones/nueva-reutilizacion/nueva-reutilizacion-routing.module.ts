import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaReutilizacionPage } from './nueva-reutilizacion.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaReutilizacionPage
  },
  {
    path: 'step-one-reu',
    loadChildren: () => import('./step-one-reu/step-one-reu.module').then( m => m.StepOneReuPageModule)
  },
  {
    path: 'step-two-reu',
    loadChildren: () => import('./step-two-reu/step-two-reu.module').then( m => m.StepTwoReuPageModule)
  },
  {
    path: 'step-three-reu',
    loadChildren: () => import('./step-three-reu/step-three-reu.module').then( m => m.StepThreeReuPageModule)
  },
  {
    path: 'step-four-reu',
    loadChildren: () => import('./step-four-reu/step-four-reu.module').then( m => m.StepFourReuPageModule)
  },
  {
    path: 'step-five-reu',
    loadChildren: () => import('./step-five-reu/step-five-reu.module').then( m => m.StepFiveReuPageModule)
  },
  {
    path: 'step-six-reu',
    loadChildren: () => import('./step-six-reu/step-six-reu.module').then( m => m.StepSixReuPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaReutilizacionPageRoutingModule {}
