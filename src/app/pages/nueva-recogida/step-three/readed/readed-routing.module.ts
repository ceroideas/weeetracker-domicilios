import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReadedPage } from './readed.page';

const routes: Routes = [
  {
    path: '',
    component: ReadedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadedPageRoutingModule {}
