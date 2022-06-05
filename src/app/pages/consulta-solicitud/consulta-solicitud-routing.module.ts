import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaSolicitudPage } from './consulta-solicitud.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaSolicitudPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaSolicitudPageRoutingModule {}
