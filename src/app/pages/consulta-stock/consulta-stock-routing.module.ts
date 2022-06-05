import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsultaStockPage } from './consulta-stock.page';

const routes: Routes = [
  {
    path: '',
    component: ConsultaStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultaStockPageRoutingModule {}
