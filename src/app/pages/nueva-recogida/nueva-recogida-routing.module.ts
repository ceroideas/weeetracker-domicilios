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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaRecogidaPageRoutingModule {}
