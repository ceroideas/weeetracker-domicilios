import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditReadPage } from './edit-read.page';

const routes: Routes = [
  {
    path: '',
    component: EditReadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditReadPageRoutingModule {}
