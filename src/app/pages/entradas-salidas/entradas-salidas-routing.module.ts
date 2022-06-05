import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntradasSalidasPage } from './entradas-salidas.page';

const routes: Routes = [
  {
    path: '',
    component: EntradasSalidasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntradasSalidasPageRoutingModule {}
