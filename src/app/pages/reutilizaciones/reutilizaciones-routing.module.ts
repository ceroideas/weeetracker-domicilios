import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReutilizacionesPage } from './reutilizaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ReutilizacionesPage
  },{
    path: 'nueva-reutilizacion',
    loadChildren: () => import('./nueva-reutilizacion/nueva-reutilizacion.module').then( m => m.NuevaReutilizacionPageModule)
  },
  {
    path: 'nueva-recogida-reutilizacion',
    loadChildren: () => import('./nueva-recogida-reutilizacion/nueva-recogida-reutilizacion.module').then( m => m.NuevaRecogidaReutilizacionPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReutilizacionesPageRoutingModule {}
