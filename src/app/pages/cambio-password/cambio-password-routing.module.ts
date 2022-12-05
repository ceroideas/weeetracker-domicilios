import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CambioPasswordPage } from './cambio-password.page';

const routes: Routes = [
  {
    path: '',
    component: CambioPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CambioPasswordPageRoutingModule {}
