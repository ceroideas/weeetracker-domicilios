import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleEtiquetaPage } from './detalle-etiqueta.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleEtiquetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleEtiquetaPageRoutingModule {}
