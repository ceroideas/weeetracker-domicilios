import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperativasRealizadasPage } from './operativas-realizadas.page';

const routes: Routes = [
  {
    path: '',
    component: OperativasRealizadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperativasRealizadasPageRoutingModule {}
