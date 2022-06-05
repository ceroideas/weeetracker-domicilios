import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdentificacionResiduosPage } from './identificacion-residuos.page';

const routes: Routes = [
  {
    path: '',
    component: IdentificacionResiduosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdentificacionResiduosPageRoutingModule {}
