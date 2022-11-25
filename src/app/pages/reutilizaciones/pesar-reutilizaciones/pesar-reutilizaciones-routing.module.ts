import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PesarReutilizacionesPage } from './pesar-reutilizaciones.page';

const routes: Routes = [
  {
    path: '',
    component: PesarReutilizacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PesarReutilizacionesPageRoutingModule {}
