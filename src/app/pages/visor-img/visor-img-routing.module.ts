import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisorImgPage } from './visor-img.page';

const routes: Routes = [
  {
    path: '',
    component: VisorImgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisorImgPageRoutingModule {}
