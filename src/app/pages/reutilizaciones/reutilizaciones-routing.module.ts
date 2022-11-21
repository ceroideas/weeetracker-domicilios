import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReutilizacionesPage } from './reutilizaciones.page';

const routes: Routes = [
  {
    path: '',
    component: ReutilizacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReutilizacionesPageRoutingModule {}
