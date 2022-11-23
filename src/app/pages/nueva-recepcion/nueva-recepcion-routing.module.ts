import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaRecepcionPage } from './nueva-recepcion.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaRecepcionPage
  },
  {
    path: 'step-one-rcp',
    loadChildren: () => import('./step-one-rcp/step-one-rcp.module').then( m => m.StepOneRcpPageModule)
  },
  {
    path: 'step-two-rcp',
    loadChildren: () => import('./step-two-rcp/step-two-rcp.module').then( m => m.StepTwoRcpPageModule)
  },
  {
    path: 'step-three-rcp',
    loadChildren: () => import('./step-three-rcp/step-three-rcp.module').then( m => m.StepThreeRcpPageModule)
  },
  {
    path: 'step-four-rcp',
    loadChildren: () => import('./step-four-rcp/step-four-rcp.module').then( m => m.StepFourRcpPageModule)
  },
  {
    path: 'step-five-rcp',
    loadChildren: () => import('./step-five-rcp/step-five-rcp.module').then( m => m.StepFiveRcpPageModule)
  },
  {
    path: 'step-six-rcp',
    loadChildren: () => import('./step-six-rcp/step-six-rcp.module').then( m => m.StepSixRcpPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaRecepcionPageRoutingModule {}
