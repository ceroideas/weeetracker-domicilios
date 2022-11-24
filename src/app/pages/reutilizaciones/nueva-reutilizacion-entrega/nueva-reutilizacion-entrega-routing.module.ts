import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaReutilizacionEntregaPage } from './nueva-reutilizacion-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaReutilizacionEntregaPage
  },
  {
    path: 'step-one-rep',
    loadChildren: () => import('./step-one-rep/step-one-rep.module').then( m => m.StepOneRepPageModule)
  },
  {
    path: 'step-two-rep',
    loadChildren: () => import('./step-two-rep/step-two-rep.module').then( m => m.StepTwoRepPageModule)
  },
  {
    path: 'step-three-rep',
    loadChildren: () => import('./step-three-rep/step-three-rep.module').then( m => m.StepThreeRepPageModule)
  },
  {
    path: 'step-four-rep',
    loadChildren: () => import('./step-four-rep/step-four-rep.module').then( m => m.StepFourRepPageModule)
  },
  {
    path: 'step-five-rep',
    loadChildren: () => import('./step-five-rep/step-five-rep.module').then( m => m.StepFiveRepPageModule)
  },
  {
    path: 'step-six-rep',
    loadChildren: () => import('./step-six-rep/step-six-rep.module').then( m => m.StepSixRepPageModule)
  },
  {
    path: 'step-seven-rep',
    loadChildren: () => import('./step-seven-rep/step-seven-rep.module').then( m => m.StepSevenRepPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaReutilizacionEntregaPageRoutingModule {}
