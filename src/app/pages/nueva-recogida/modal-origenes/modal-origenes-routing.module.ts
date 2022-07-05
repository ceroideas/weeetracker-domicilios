import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalOrigenesPage } from './modal-origenes.page';

const routes: Routes = [
  {
    path: '',
    component: ModalOrigenesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalOrigenesPageRoutingModule {}
