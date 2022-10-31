import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaEntregaPage } from './nueva-entrega.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaEntregaPage
  },
  {
    path: 'step-one-ent',
    loadChildren: () => import('./step-one-ent/step-one-ent.module').then( m => m.StepOneEntPageModule)
  },
  {
    path: 'step-two-ent',
    loadChildren: () => import('./step-two-ent/step-two-ent.module').then( m => m.StepTwoEntPageModule)
  },
  {
    path: 'step-three-ent',
    loadChildren: () => import('./step-three-ent/step-three-ent.module').then( m => m.StepThreeEntPageModule)
  },
  {
    path: 'step-four-ent',
    loadChildren: () => import('./step-four-ent/step-four-ent.module').then( m => m.StepFourEntPageModule)
  },
  {
    path: 'step-five-ent',
    loadChildren: () => import('./step-five-ent/step-five-ent.module').then( m => m.StepFiveEntPageModule)
  },
  {
    path: 'step-six-ent',
    loadChildren: () => import('./step-six-ent/step-six-ent.module').then( m => m.StepSixEntPageModule)
  },
  {
    path: 'step-seven-ent',
    loadChildren: () => import('./step-seven-ent/step-seven-ent.module').then( m => m.StepSevenEntPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaEntregaPageRoutingModule {}
