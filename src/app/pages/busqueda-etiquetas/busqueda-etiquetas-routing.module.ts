import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BusquedaEtiquetasPage } from './busqueda-etiquetas.page';

const routes: Routes = [
  {
    path: '',
    component: BusquedaEtiquetasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusquedaEtiquetasPageRoutingModule {}
