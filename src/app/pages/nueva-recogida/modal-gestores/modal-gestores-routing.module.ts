import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalGestoresPage } from './modal-gestores.page';

const routes: Routes = [
  {
    path: '',
    component: ModalGestoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalGestoresPageRoutingModule {}
