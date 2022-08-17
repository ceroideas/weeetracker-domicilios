import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaRecogidaPage } from './nueva-recogida.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaRecogidaPage
  },
  {
    path: 'step-one',
    loadChildren: () => import('./step-one/step-one.module').then( m => m.StepOnePageModule)
  },
  {
    path: 'step-two',
    loadChildren: () => import('./step-two/step-two.module').then( m => m.StepTwoPageModule)
  },
  {
    path: 'step-two-alt',
    loadChildren: () => import('./step-two-alt/step-two-alt.module').then( m => m.StepTwoAltPageModule)
  },
  {
    path: 'modal-gestores',
    loadChildren: () => import('./modal-gestores/modal-gestores.module').then( m => m.ModalGestoresPageModule)
  },
  {
    path: 'modal-origenes',
    loadChildren: () => import('./modal-origenes/modal-origenes.module').then( m => m.ModalOrigenesPageModule)
  },
  {
    path: 'step-three',
    loadChildren: () => import('./step-three/step-three.module').then( m => m.StepThreePageModule)
  },
  {
    path: 'qr',
    loadChildren: () => import('./qr/qr.module').then( m => m.QrPageModule)
  },
  {
    path: 'step-four',
    loadChildren: () => import('./step-four/step-four.module').then( m => m.StepFourPageModule)
  },
  {
    path: 'step-five',
    loadChildren: () => import('./step-five/step-five.module').then( m => m.StepFivePageModule)
  },
  {
    path: 'step-six',
    loadChildren: () => import('./step-six/step-six.module').then( m => m.StepSixPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaRecogidaPageRoutingModule {}
