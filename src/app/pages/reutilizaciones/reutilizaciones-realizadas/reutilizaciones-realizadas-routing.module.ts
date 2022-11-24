import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReutilizacionesRealizadasPage } from './reutilizaciones-realizadas.page';

const routes: Routes = [
  {
    path: '',
    component: ReutilizacionesRealizadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReutilizacionesRealizadasPageRoutingModule {}
