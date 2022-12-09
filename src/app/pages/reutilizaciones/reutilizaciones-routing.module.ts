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
  {
    path: 'nueva-reutilizacion-entrega',
    loadChildren: () => import('./nueva-reutilizacion-entrega/nueva-reutilizacion-entrega.module').then( m => m.NuevaReutilizacionEntregaPageModule)
  },
  {
    path: 'nueva-reutilizacion-entrega-directa',
    loadChildren: () => import('./nueva-reutilizacion-entrega-directa/nueva-reutilizacion-entrega-directa.module').then( m => m.NuevaReutilizacionEntregaDirectaPageModule)
  },
  {
    path: 'reutilizaciones-realizadas',
    loadChildren: () => import('./reutilizaciones-realizadas/reutilizaciones-realizadas.module').then( m => m.ReutilizacionesRealizadasPageModule)
  },
  {
    path: 'pesar-reutilizaciones',
    loadChildren: () => import('./pesar-reutilizaciones/pesar-reutilizaciones.module').then( m => m.PesarReutilizacionesPageModule)
  },
  {
    path: 'stock2',
    loadChildren: () => import('./stock2/stock2.module').then( m => m.Stock2PageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReutilizacionesPageRoutingModule {}
