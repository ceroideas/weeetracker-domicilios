import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Stock2Page } from './stock2.page';

const routes: Routes = [
  {
    path: '',
    component: Stock2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Stock2PageRoutingModule {}
