import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PesarRaeesPage } from './pesar-raees.page';

const routes: Routes = [
  {
    path: '',
    component: PesarRaeesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PesarRaeesPageRoutingModule {}
